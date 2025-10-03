import {ICoachRepository} from "@interfaces/ICoachRepository";
import {inject, injectable} from "inversify";
import {Person} from "@essences/person";
import {Roles} from "@essences/Roles";
import {IPersonRepository} from "@repository/PersonRepository";
import {QueryResult} from "pg";
import {IDBconnection} from "@repository/DBconnection";
import {ID, OnlyDate} from "@essences/Types";
import {BaseEvent} from "@essences/Event";
import {Specialization} from "@essences/Specialization";
import {AllowedRoles} from "@repository/DBDecorator";

@injectable()
export class CoachRepository implements ICoachRepository {
    private readonly base_table: string = "coach";

    constructor(
        @inject("IDBconnection") private DB: IDBconnection,
        @inject("IPersonRepository") private personRepository: IPersonRepository,
    ) {}

    async get(login: string, password: string, token: string): Promise<Person> {
        return this.personRepository.get(login, password, token, this.base_table, Roles.coach);
    }

    async create(login: string, password: string, name: string, surname: string): Promise<Person> {
        return this.personRepository.create(login, password, name, surname, this.base_table, Roles.coach);
    }

    async delete(login: string): Promise<void> {
        return this.personRepository.delete(login, this.base_table);
    }

    async get_all(): Promise<Person[]> {
        return this.personRepository.get_all(this.base_table);
    }

    @AllowedRoles(Roles.admin)
    async add_specialization(coach_login: string, specialization: ID): Promise<void> {
        await this.DB.query(
            `INSERT INTO coachspecialization (specid, coachid)
             SELECT $1, id
             FROM coach
             WHERE login = $2
               AND NOT EXISTS (
                 SELECT 1
                 FROM coachspecialization
                 WHERE specid = $1 AND coachid = coach.id
             )`,
            [specialization, coach_login]
        );
    }

    @AllowedRoles(Roles.admin)
    async delete_specialization(coach_login: string, specialization: ID): Promise<void> {
        await this.DB.query(
            `DELETE FROM coachspecialization
             WHERE specid = $1
             AND coachid IN (SELECT id FROM coach WHERE login = $2)`,
                [specialization, coach_login]
        );
    }

    @AllowedRoles(Roles.admin)
    async get_specialization_types(): Promise<Specialization[]> {
        const res: QueryResult = await this.DB.query(
            `SELECT cst.id, cst.name, h.name AS hall_name 
             FROM coachspecializationtypes cst 
             JOIN hall h ON cst.hallid = h.id`);

        return Array.from(res.rows, x => new Specialization(x.id, x.name, x.hall_name));
    }

    @AllowedRoles(Roles.admin)
    async get_specializations(login: string): Promise<Specialization[]> {
        const res: QueryResult = await this.DB.query(
            'SELECT * FROM get_coach_specializations($1)',
            [login]
        );

        return res.rows.map(row =>
            new Specialization(row.id, row.name, row.hall_name)
        );
    }

    @AllowedRoles(Roles.admin, Roles.coach)
    async get_signs(_role: Roles, coach: ID, from?: OnlyDate, to?: OnlyDate): Promise<BaseEvent[]> {
        const [events, indivTrainings] = await Promise.all([
            this.queryStandardTrainings(coach, from, to),
            this.queryIndividualTrainings(coach, from, to)
        ]);

        return this.personRepository.generate_signs_arr(events, indivTrainings);
    }

    private async queryStandardTrainings(coach: ID, from?: OnlyDate, to?: OnlyDate): Promise<QueryResult> {
        const req = `SELECT std.id, std.name, a.login as admin_login, c.login as coach_login, h.name as hall_name, 
                            std.capacity, std.datetime, std.duration FROM standarttraining std
                        JOIN admin a on a.id = std.adminid
                        JOIN coach c on c.id = std.coachid
                        JOIN hall h on h.id = std.hallid`;

        const query = from
            ? `${req}
               WHERE datetime BETWEEN $1 AND $2 AND coachid = $3`
            : `${req}
               WHERE datetime > NOW() AND coachid = $1`;

        return this.DB.query(query, from ? [from, to, coach] : [coach]);
    }

    private async queryIndividualTrainings(coach: ID, from?: OnlyDate, to?: OnlyDate): Promise<QueryResult> {
        const req = `SELECT it.id, c.login as coach_login, h.name as hall_name, cl.login as client_login, it.datetime, it.duration, it.notes from individualtraining it
                        JOIN coach c on c.id = it.coachid
                        JOIN hall h on h.id = it.hallid
                        JOIN client cl on cl.id = it.clientid`;

        const query = from
            ? `${req}
               WHERE coachid = $3 AND datetime BETWEEN $1 AND $2`
            : `${req} WHERE datetime > NOW() AND coachid = $1`;

        return this.DB.query(query, from ? [from, to, coach] : [coach]);
    }
}