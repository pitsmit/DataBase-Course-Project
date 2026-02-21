import {inject} from "inversify";
import {Person} from "@essences/person";
import {Schedule} from "@essences/Schedule";
import {ICoachScheduleRepository} from "@interfaces/ICoachScheduleRepository";
import {AdminOrCoach} from "@services/Decorators";
import {Days, ID, OnlyDate, OnlyTime} from "@essences/Types";

export interface ICoachScheduleManager {
    set_schedule_by_day(_person: Person, date: OnlyDate, start: OnlyTime, end: OnlyTime, coach: ID): Promise<void>;
    set_schedule_for_week(_person: Person, start_day: Days, end_day: Days,
                          start: OnlyTime, end: OnlyTime, coach: ID): Promise<void>;
    show_schedule(_person: Person, coach: ID, from?: OnlyDate, to?: OnlyDate): Promise<Schedule[]>;
}

export class CoachScheduleManager implements ICoachScheduleManager {
    constructor(@inject("ICoachScheduleRepository") private _csh_repository: ICoachScheduleRepository) {
    }

    @AdminOrCoach()
    async set_schedule_by_day(_person: Person, date: OnlyDate, start: OnlyTime, end: OnlyTime,
                              coach: ID): Promise<void> {
        await this._csh_repository.set_schedule_by_day(_person.role, coach, date, start, end);
    }

    @AdminOrCoach()
    async set_schedule_for_week(_person: Person, start_day: Days, end_day: Days,
                            start: OnlyTime, end: OnlyTime, coach: ID): Promise<void> {
        await this._csh_repository.set_schedule_for_week(_person.role, coach, start_day, end_day, start, end);
    }

    @AdminOrCoach()
    async show_schedule(_person: Person, coach: ID, from?: OnlyDate, to?: OnlyDate): Promise<Schedule[]> {
        return await this._csh_repository.get_schedule(_person.role, coach, from, to);
    }
}