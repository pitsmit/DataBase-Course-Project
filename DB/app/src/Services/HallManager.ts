import {inject} from "inversify";
import {IHallRepository} from "@interfaces/IHallRepository";
import {Person} from "@essences/person";
import {Schedule} from "@essences/Schedule";
import {Hall} from "@essences/Hall";
import {AdminOnly, CoachOnly} from "@services/Decorators";
import {ID, OnlyDate, OnlyTime} from "@essences/Types";

export interface IHallManager {
    show_halls(admin: Person): Promise<Hall[]>;
    show_hall_schedule(_admin: Person, hall: ID, start?: OnlyDate, end?: OnlyDate): Promise<Schedule[]>;
    set_schedule_by_day(_admin: Person, hall: ID, date: OnlyDate, start: OnlyTime, end: OnlyTime): Promise<void>;
    set_schedule_standart(_admin: Person, hall: ID, start: OnlyDate, end: OnlyDate): Promise<void>;
    show_available_halls(_coach: Person): Promise<Hall[]>;
}

export class HallManager implements IHallManager {
    constructor(@inject("IHallRepository") private _hall_repository: IHallRepository) {
    }

    @AdminOnly()
    async show_halls(_admin: Person): Promise<Hall[]> {
        return await this._hall_repository.get_all();
    }

    @AdminOnly()
    async show_hall_schedule(_admin: Person, hall: ID, start?: OnlyDate, end?: OnlyDate): Promise<Schedule[]> {
        return await this._hall_repository.get_hall_schedule(hall, start, end);
    }

    @AdminOnly()
    async set_schedule_by_day(_admin: Person, hall: ID, date: OnlyDate, start: OnlyTime, end: OnlyTime): Promise<void> {
        await this._hall_repository.set_schedule_by_day(hall, date, start, end);
    }

    @AdminOnly()
    async set_schedule_standart(_admin: Person, hall: ID, start: OnlyDate, end: OnlyDate): Promise<void> {
        await this._hall_repository.set_schedule_standart(hall, start, end);
    }

    @CoachOnly()
    async show_available_halls(_coach: Person): Promise<Hall[]> {
        return await this._hall_repository.get_available_halls(_coach.id);
    }
}