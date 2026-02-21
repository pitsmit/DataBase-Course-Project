import {Command} from "@commands/BaseCommand";
import {Person} from "@essences/person";
import {Hall} from "@essences/Hall";
import {Schedule} from "@essences/Schedule";
import {input} from "@front/iostream";
import {ID, OnlyDate, OnlyTime} from "@essences/Types";
import {ShowTable} from "@commands/ShowTable";

export class HallCommand extends Command {
    protected readonly _person: Person;

    constructor(person: Person) {
        super();
        this._person = person;
    }
}

export class ShowHallsCommand extends HallCommand {
    async execute(): Promise<void> {
        let halls: Hall[] = await this._HallManager.show_halls(this._person);

        ShowTable.show(halls, ['ID', 'Название'], ["id", "name"], [5, 20]);
    }
}

export class ShowHallScheduleCommand extends HallCommand {
    async execute(): Promise<void> {
        const id: ID = Number(await input("Введите ID зала: "));
        const start: OnlyDate = await input("Введите дату начала в формате ГГГГ-ММ-ДД " +
            "(или оставьте пустым для получения актуального): ") as OnlyDate;
        const end: OnlyDate = await input("Введите дату конца в формате ГГГГ-ММ-ДД " +
            "(или оставьте пустым для получения актуального): ") as OnlyDate;

        const sched: Schedule[] = await this._HallManager.show_hall_schedule(this._person, id, start, end);

        ShowTable.show(sched, ['Дата', 'Время начала', 'Время окончания'], ["day", "start_time", "end_time"], [20, 20, 20]);
    }
}

export class SetHallScheduleByDayCommand extends HallCommand {
    async execute(): Promise<void> {
        const id: ID = Number(await input("Введите ID зала: "));
        const date: OnlyDate = await input("Введите дату в формате ГГГГ-ММ-ДД: ") as OnlyDate;
        const start: OnlyTime = await input("Введите время начала в формате ЧЧ:ММ:СС: ") as OnlyTime;
        const end: OnlyTime = await input("Введите время конца в формате ЧЧ:ММ:СС: ") as OnlyTime;

        await this._HallManager.set_schedule_by_day(this._person, id, date, start, end);
    }
}

export class SetHallScheduleStandartCommand extends HallCommand {
    async execute(): Promise<void> {
        const id: ID = Number(await input("Введите ID зала: "));
        const start: OnlyDate = await input("Введите дату начала в формате ГГГГ-ММ-ДД: ") as OnlyDate;
        const end: OnlyDate = await input("Введите дату конца в формате ГГГГ-ММ-ДД: ") as OnlyDate;

        await this._HallManager.set_schedule_standart(this._person, id, start, end);
    }
}

export class ShowAvailableCoachHallsCommand extends HallCommand {
    async execute(): Promise<void> {
        const hals: Hall[] = await this._HallManager.show_available_halls(this._person);

        ShowTable.show(hals, ["ID", "Название"], ["id", "name"], [5, 20]);
    }
}