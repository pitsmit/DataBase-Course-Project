import {Schedule} from "@essences/Schedule";
import {Days, ID, OnlyDate, OnlyTime} from "@essences/Types";
import {Roles} from "@essences/Roles";

export interface ICoachScheduleRepository {
    set_schedule_by_day(_role: Roles, coach: ID, date: OnlyDate, start: OnlyTime, end: OnlyTime): Promise<void>;
    set_schedule_for_week(_role: Roles, coach: ID, start_day: Days, end_day: Days,
                          start: OnlyTime, end: OnlyTime): Promise<void>;
    get_schedule(role: Roles, coach: ID, from?: OnlyDate, to?: OnlyDate): Promise<Schedule[]>;
}