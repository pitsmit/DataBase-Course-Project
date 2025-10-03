import {IClientRepository} from "@interfaces/IClientRepository";
import {inject, injectable} from "inversify";
import {Person} from "@essences/person";
import {Roles} from "@essences/Roles";
import {IPersonRepository} from "@repository/PersonRepository";
import {ID, OnlyDate} from "@essences/Types";
import {BaseEvent} from "@essences/Event";
import {QueryResult} from "pg";
import {IDBconnection} from "@repository/DBconnection";
import {AllowedRoles} from "@repository/DBDecorator";

@injectable()
export class ClientRepository implements IClientRepository {
    private readonly base_table: string = "client";

    constructor(
        @inject("IDBconnection") private DB: IDBconnection,
        @inject("IPersonRepository") private personRepository: IPersonRepository,
    ) {}

    async get(login: string, password: string, token: string): Promise<Person> {
        return this.personRepository.get(login, password, token, this.base_table, Roles.client);
    }

    async create(login: string, password: string, name: string, surname: string): Promise<Person> {
        return this.personRepository.create(login, password, name, surname, this.base_table, Roles.client);
    }

    async delete(login: string): Promise<void> {
        return this.personRepository.delete(login, this.base_table);
    }

    async get_all(): Promise<Person[]> {
        return this.personRepository.get_all(this.base_table);
    }

    @AllowedRoles(Roles.client)
    async get_signs(client: ID, from?: OnlyDate, to?: OnlyDate): Promise<BaseEvent[]> {
        const [events, indivTrainings] = await Promise.all([
            this.queryStandardTrainings(client, from, to),
            this.queryIndividualTrainings(client, from, to)
        ]);

        return this.personRepository.generate_signs_arr(events, indivTrainings);
    }

    private async queryStandardTrainings(client: ID, from?: OnlyDate, to?: OnlyDate): Promise<QueryResult> {
        const reg = `SELECT st.id, st.datetime, st.name, h.name as hall_name, c.name as coach_name, c.surname as coach_surname, st.duration
        FROM standarttraining st
        JOIN hall h on st.hallid = h.id
        JOIN coach c on st.coachid = c.id`

        const query = from
            ? `${reg}
           JOIN trainingsigns ts ON st.ID = ts.stdtrainingid
           WHERE st.datetime BETWEEN $1 AND $2 AND ts.clientid = $3`
            : `${reg}
           JOIN trainingsigns ts ON st.ID = ts.stdtrainingid
           WHERE st.datetime > NOW() AND ts.clientid = $1`;

        return this.DB.query(query, from ? [from, to, client] : [client]);
    }

    private async queryIndividualTrainings(client: ID, from?: OnlyDate, to?: OnlyDate): Promise<QueryResult> {
        const reg = `SELECT it.id, it.datetime, h.name as hall_name, c.name as coach_name, c.surname as coach_surname, it.duration, it.notes
        FROM individualtraining it
        JOIN hall h on it.hallid = h.id
        JOIN coach c on it.coachid = c.id`

        const query = from
            ? `${reg}
           WHERE clientid = $3 AND datetime BETWEEN $1 AND $2`
            : `${reg} 
           WHERE datetime > NOW() AND clientid = $1`;

        return this.DB.query(query, from ? [from, to, client] : [client]);
    }
}