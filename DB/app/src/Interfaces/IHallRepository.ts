import {Schedule} from "@essences/Schedule";
import {Hall} from "@essences/Hall";
import {ID, OnlyDate, OnlyTime} from "@essences/Types";

export interface IHallRepository {
    get_all(): Promise<Hall[]>;
    get_hall_schedule(hall: ID, start?: OnlyDate, end?: OnlyDate): Promise<Schedule[]>;

    set_schedule_by_day(hall: ID, date: OnlyDate, start: OnlyTime, end: OnlyTime): Promise<void>;
    set_schedule_standart(hall: ID, start: OnlyDate, end: OnlyDate): Promise<void>;
    get_available_halls(coach: ID): Promise<Hall[]>;
}