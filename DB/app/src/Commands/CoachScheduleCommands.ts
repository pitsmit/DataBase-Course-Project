import {Command} from "@commands/BaseCommand";
import {Person} from "@essences/person";
import {Days, ID, OnlyDate, OnlyTime} from "@essences/Types";
import {input} from "@front/iostream";
import {Schedule} from "@essences/Schedule";
import {ShowTable} from "@commands/ShowTable";
import {Roles} from "@essences/Roles";

export class CoachScheduleCommand extends Command {
    protected readonly _person: Person;

    constructor(person: Person) {
        super();
        this._person = person;
    }
}

export class SetCoachScheduleByDayCommand extends CoachScheduleCommand {
    async execute(): Promise<void> {
        let id: ID = this._person.id;
        if (this._person.role == Roles.admin)
            id = Number(await input("Введите id тренера: "));
        const date: OnlyDate = await input("Введите дату в формате ГГГГ-ММ-ДД: ") as OnlyDate;
        const start: OnlyTime = await input("Введите время начала в формате ЧЧ:ММ:СС: ") as OnlyTime;
        const end: OnlyTime = await input("Введите время конца в формате ЧЧ:ММ:СС: ") as OnlyTime;

        await this._CoachScheduleManager.set_schedule_by_day(this._person, date, start, end, id);
    }
}

export class SetCoachScheduleForWeekCommand extends CoachScheduleCommand {
    async execute(): Promise<void> {
        let id: ID = this._person.id;
        if (this._person.role == Roles.admin)
            id = Number(await input("Введите id тренера: "));
        const start_day: Days = Number(await input("Введите номер дня(1-пон, 2-вт, ...): "));
        const end_day: Days = Number(await input("Введите номер дня(1-пон, 2-вт, ...): "));

        const start: OnlyTime = await input("Введите время начала в формате ЧЧ:ММ:СС: ") as OnlyTime;
        const end: OnlyTime = await input("Введите время конца в формате ЧЧ:ММ:СС: ") as OnlyTime;

        await this._CoachScheduleManager.set_schedule_for_week(this._person, start_day, end_day, start, end, id);
    }
}

export class ShowCoachScheduleCommand extends CoachScheduleCommand {
    async execute(): Promise<void> {
        let id: ID = this._person.id;
        if (this._person.role == Roles.admin)
            id = Number(await input("Введите id тренера: "));
        const from: OnlyDate = await input("Введите дату начала в формате ГГГГ-ММ-ДД: ") as OnlyDate;
        const to: OnlyDate = await input("Введите дату конца в формате ГГГГ-ММ-ДД: ") as OnlyDate;

        const sched: Schedule[] = await this._CoachScheduleManager.
        show_schedule(this._person, id, from, to);

        ShowTable.show(sched, ['Дата', 'Время начала', 'Время окончания'], ["day", "start_time", "end_time"], [20, 20, 20]);
    }
}