import {inject, injectable} from "inversify";
import {IDBconnection} from "@repository/DBconnection";
import {QueryResult} from "pg";
import {ICoachScheduleRepository} from "@interfaces/ICoachScheduleRepository";
import {Schedule} from "@essences/Schedule";
import {Days, ID, OnlyDate, OnlyTime} from "@essences/Types";
import {AllowedRoles} from "@repository/DBDecorator";
import {Roles} from "@essences/Roles";

@injectable()
export class CoachScheduleRepository implements ICoachScheduleRepository {
    constructor(
        @inject("IDBconnection") private DB: IDBconnection,
    ) {}

    @AllowedRoles(Roles.admin, Roles.coach)
    async set_schedule_by_day(_role: Roles, coach: ID, date: OnlyDate, start: OnlyTime, end: OnlyTime): Promise<void> {
        const query = `
            INSERT INTO coachschedule (coachid, date, start, stop)
            SELECT $1, $2::date, $3, $4
            WHERE $2::date >= CURRENT_DATE
            ON CONFLICT ON CONSTRAINT unique_coachid_date
                DO UPDATE SET
                              start = EXCLUDED.start,
                              stop = EXCLUDED.stop
            RETURNING ID`;
        await this.DB.query(query, [coach, date, start, end]);
    }

    @AllowedRoles(Roles.admin, Roles.coach)
    async set_schedule_for_week(_role: Roles, coach: ID, start_day: Days, end_day: Days,
                                start: OnlyTime, end: OnlyTime): Promise<void> {
        const today = new Date();
        const currentDayOfWeek: number = today.getDay() || 7; // Воскресенье = 7 (а не 0)

        // Находим ближайший start_day
        let daysUntilStartDay: number = (start_day - currentDayOfWeek + 7) % 7 + 1;
        const startDate = new Date(today);
        startDate.setDate(today.getDate() + daysUntilStartDay);
        startDate.setHours(0, 0, 0, 0);

        let daysToAdd: number;
        if (end_day >= start_day) {
            daysToAdd = end_day - start_day;
        } else {
            daysToAdd = (7 - start_day) + end_day;
        }

        const startDateStr: string = startDate.toISOString().split('T')[0];

        const query = `
        INSERT INTO coachschedule (coachid, date, start, stop)
        SELECT 
            $1, 
            (date '${startDateStr}' + (n || ' days')::interval)::date,
            $3, 
            $4
        FROM generate_series(0, $2::int) AS n
        ON CONFLICT ON CONSTRAINT unique_coachid_date
            DO UPDATE SET
                start = EXCLUDED.start,
                stop = EXCLUDED.stop`;

        await this.DB.query(query, [coach, daysToAdd, start, end]);
    }

    @AllowedRoles(Roles.admin, Roles.coach)
    async get_schedule(_role: Roles, coach: ID, from?: OnlyDate, to?: OnlyDate): Promise<Schedule[]> {
        let query: string = from ? `SELECT id, date::text, start, stop FROM coachschedule 
                             WHERE coachid = $1 AND date BETWEEN $2::date AND $3::date ORDER BY date`
        : `SELECT id, date::text, start, stop FROM coachschedule 
                             WHERE coachid = $1 AND date >= current_date ORDER BY date`;

        let res: QueryResult = await this.DB.query(query, from ? [coach, from, to] : [coach]);

        return Array.from(res.rows, x => new Schedule(x.id, x.date, x.start, x.stop));
    }
}