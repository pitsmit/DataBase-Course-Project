import {inject, injectable} from "inversify";
import {IDBconnection} from "@repository/DBconnection";
import {QueryResult} from "pg";
import {IEventsRepository} from "@interfaces/IEventsRepository";
import {AnySign, StandartEvent} from "@essences/Event";
import {EventUpdate, ID, OnlyDate} from "@essences/Types";
import {Roles} from "@essences/Roles";
import {AllowedRoles} from "@repository/DBDecorator";

@injectable()
export class EventsRepository implements IEventsRepository {
    constructor(
        @inject("IDBconnection") private DB: IDBconnection,
    ) {}

    @AllowedRoles(Roles.admin)
    async create(admin: ID, date: Date, hall: ID, coach: ID, duration: number,
                 name: string, capacity: number): Promise<StandartEvent> {
        const query = `INSERT INTO standarttraining(name, adminid, coachid, hallid, capacity, datetime, duration)
                       VALUES ($1, $2, $3, $4, $5, $6, $7)
                       RETURNING id, name, adminid, coachid, hallid, capacity, datetime, duration`;
        const res: QueryResult = await this.DB.query(query, [name, admin, coach, hall, capacity, date, duration]);
        const event: any = res.rows[0];

        return new StandartEvent(
            event.id,
            event.datetime,
            event.hallid,
            event.coachid,
            event.duration,
            event.name,
            event.capacity,
            event.adminid);
    }

    @AllowedRoles(Roles.admin)
    async delete(training: ID): Promise<void> {
        await this.DB.query(`DELETE FROM standarttraining WHERE id = $1`, [training]);
    }

    @AllowedRoles(Roles.admin)
    async update_event_field(training: ID, update: EventUpdate): Promise<void> {
        const query = `UPDATE standarttraining SET ${update.field} = $1 WHERE id = $2`
        await this.DB.query(query, [update.value, training]);
    }

    @AllowedRoles(Roles.admin)
    async show_events(from?: OnlyDate, to?: OnlyDate): Promise<StandartEvent[]> {
        const reg = `SELECT stt.id, stt.name, a.login as adminlogin, c.login as coachlogin, h.name as hallname, stt.capacity, stt.datetime, stt.duration
             FROM standarttraining stt
             JOIN admin a ON a.id = stt.adminid
             JOIN coach c ON c.id = stt.coachid
             JOIN hall h ON h.id = stt.hallid`;

        const query = from
            ? `${reg} WHERE stt.datetime BETWEEN $1 AND $2 ORDER BY stt.datetime`
            : `${reg} WHERE stt.datetime > now() ORDER BY stt.datetime`;

        const res: QueryResult = await this.DB.query(query, from ? [from, to] : []);

        return Array.from(res.rows, x =>
            new StandartEvent(x.id,
                              new Date(x.datetime),
                              x.hallname,
                              x.coachlogin,
                              x.duration,
                              x.name,
                              x.capacity,
                              x.adminlogin));
    }

    @AllowedRoles(Roles.client)
    async show_available_events(): Promise<AnySign[]> {
        const res: QueryResult = await this.DB.query('SELECT * FROM show_available_events()');
        return res.rows.map(row =>
            new AnySign(
                row.id,
                row.datetime,
                row.hall_name,
                row.coach_name + " " + row.coach_surname,
                row.duration,
                "",
                "",
                row.name,
                row.capacity,
                "",
            )
        );
    }

    @AllowedRoles(Roles.client)
    async registrate(client: ID, training: ID): Promise<void> {
        const result = await this.DB.query(
            'SELECT * FROM register_client_for_training($1, $2)',
            [client, training]
        );

        if (!result.rows[0].success) {
            throw new Error(result.rows[0].message);
        }
    }

    @AllowedRoles(Roles.client)
    async un_registrate(client: ID, training: ID): Promise<void> {
        await this.DB.query(`DELETE FROM trainingsigns 
                            WHERE clientid = $1 
                            AND stdtrainingid = $2`, [client, training]);
    }
}