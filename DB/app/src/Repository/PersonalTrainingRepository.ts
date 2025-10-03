import {inject, injectable} from "inversify";
import {IDBconnection} from "@repository/DBconnection";
import {IPersonalTrainingRepository} from "@interfaces/IPersonalTrainingRepository";
import {ID} from "@essences/Types";
import {Roles} from "@essences/Roles";
import {AllowedRoles} from "@repository/DBDecorator";

@injectable()
export class PersonalTrainingRepository implements IPersonalTrainingRepository {
    constructor(
        @inject("IDBconnection") private DB: IDBconnection,
    ) {}

    @AllowedRoles(Roles.coach)
    async create(client_login: string, coach: ID, date: Date, hall: ID, duration: number, info?: string): Promise<void> {
        const query = `INSERT INTO individualtraining (coachid, clientid, hallid, datetime, duration, notes)
                       SELECT $1, (SELECT id FROM client WHERE login = $2 LIMIT 1), $3, $4::timestamp with time zone, $5, $6
                       WHERE $4::timestamp with time zone >= NOW()
                       RETURNING id, coachid, clientid, hallid, datetime, duration, notes`;

        await this.DB.query(query, [coach, client_login, hall, date.toISOString(), duration, info || ""]);
    }

    @AllowedRoles(Roles.coach, Roles.client)
    async delete(person: ID, role: Roles, training: ID): Promise<void> {
        const query: string = role === Roles.coach ?
            `DELETE FROM individualtraining WHERE id = $1 AND coachid = $2`
            : `DELETE FROM individualtraining WHERE id = $1 AND clientid = $2`
        await this.DB.query(query, [training, person]);
    }

    @AllowedRoles(Roles.coach)
    async move(coach: ID, training: ID, date: Date): Promise<void> {
        const query = `UPDATE individualtraining SET datetime = $1 WHERE id = $2 AND coachid = $3`;
        await this.DB.query(query, [date, training, coach]);
    }

    @AllowedRoles(Roles.coach)
    async change_duration(coach: ID, training: ID, duration: number): Promise<void> {
        if (!duration) {
            throw new Error('Некорректный формат');
        }
        const query = `UPDATE individualtraining SET duration = $1 WHERE id = $2 AND coachid = $3`;
        await this.DB.query(query, [duration, training, coach]);
    }

    @AllowedRoles(Roles.coach)
    async add_info(coach: ID, training: ID, info: string): Promise<void> {
        const query = `UPDATE individualtraining SET notes = $1 WHERE id = $2 AND coachid = $3`;
        await this.DB.query(query, [info, training, coach]);
    }
}