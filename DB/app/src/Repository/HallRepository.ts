import {inject, injectable} from "inversify";
import {IDBconnection} from "@repository/DBconnection";
import {QueryResult} from "pg";
import {IHallRepository} from "@interfaces/IHallRepository";
import {Schedule} from "@essences/Schedule";
import {Hall} from "@essences/Hall";
import {ID, OnlyDate, OnlyTime} from "@essences/Types";
import {AllowedRoles} from "@repository/DBDecorator";
import {Roles} from "@essences/Roles";

@injectable()
export class HallRepository implements IHallRepository {
    constructor(
        @inject("IDBconnection") private DB: IDBconnection,
    ) {}

    @AllowedRoles(Roles.admin)
    async get_all(): Promise<Hall[]> {
        const query = `SELECT * FROM hall`;
        const res: QueryResult = await this.DB.query(query, []);
        return Array.from(res.rows, x => new Hall(x.id, x.name));
    }

    @AllowedRoles(Roles.admin)
    async get_hall_schedule(hall: ID, start?: OnlyDate, end?: OnlyDate): Promise<Schedule[]> {
        const reg = `SELECT id, date::text, start, stop FROM hallschedule WHERE hallid = $1`;
        const query: string = start
                ? `${reg} AND date BETWEEN $2::date AND $3::date ORDER BY date`
                : `${reg} AND date > now() ORDER BY date`;

        const res: QueryResult = await this.DB.query(query, start ? [hall, start, end] : [hall]);
        return res.rows.map(row => new Schedule(
            row.id,
            row.date,
            row.start,
            row.stop
        ));
    }

    @AllowedRoles(Roles.admin)
    async set_schedule_by_day(hall: ID, date: string, start: OnlyTime, end: OnlyTime): Promise<void> {
        const query = `
        INSERT INTO HallSchedule (HallID, date, start, stop)
        VALUES ($1, $2::date, $3, $4)
        ON CONFLICT ON CONSTRAINT unique_hallid_date
            DO UPDATE SET
                          start = EXCLUDED.start,
                          stop = EXCLUDED.stop
        RETURNING ID, date::text`;

        await this.DB.query(query, [hall, date, start, end]);
    }

    @AllowedRoles(Roles.admin)
    async set_schedule_standart(hall: ID, start: OnlyDate, end: OnlyDate): Promise<void> {
        const defaultStartTime = '09:00:00';
        const defaultEndTime = '21:00:00';

        await this.DB.query(`
        INSERT INTO HallSchedule (HallID, date, start, stop)
        SELECT $1, 
               generate_series($2::date, $3::date, '1 day'::interval)::date,
               $4::time,
               $5::time
        ON CONFLICT (HallID, date) DO UPDATE SET
            start = EXCLUDED.start,
            stop = EXCLUDED.stop`, [hall, start, end, defaultStartTime, defaultEndTime]);
    }

    @AllowedRoles(Roles.coach)
    async get_available_halls(coach: ID): Promise<Hall[]> {
        const query = `SELECT h.id, h.name from hall h
                       JOIN coachspecializationtypes cst ON cst.hallid = h.id
                        JOIN coachspecialization cs ON cs.specid = cst.id WHERE cs.coachid = $1`

        const res: QueryResult = await this.DB.query(query, [coach]);
        return Array.from(res.rows, x => new Hall(x.id, x.name));
    }
}