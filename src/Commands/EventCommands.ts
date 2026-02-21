import {Command} from "@commands/BaseCommand";
import {Person} from "@essences/person";
import {EventField, EventUpdate, ID, OnlyDate} from "@essences/Types";
import {input} from "@front/iostream";
import {AnySign, StandartEvent} from "@essences/Event";
import {Roles} from "@essences/Roles";
import {ShowTable} from "@commands/ShowTable";

export class EventCommand extends Command {
    protected readonly _person: Person;

    constructor(person: Person) {
        super();
        this._person = person;
    }
}

export class ShowEventsCommand extends EventCommand {
    async execute(): Promise<void> {
        const start: OnlyDate = await input("Введите дату начала в формате ГГГГ-ММ-ДД " +
            "(или оставьте пустым для получения только будущих): ") as OnlyDate;
        const end: OnlyDate = await input("Введите дату конца в формате ГГГГ-ММ-ДД " +
            "(или оставьте пустым для получения только будущих): ") as OnlyDate;

        const res: StandartEvent[] = await this._EventManager.show_events(this._person, start, end);

        ShowTable.show(res, ['ID', 'Название', 'Дата и время', `Зал`, `Тренер`, `Админ`, `Продолжительность`, `Вместимость`],
        ["id", "name", "date", "hall", "coach", "admin", "duration", "capacity"],
            [5, 20, 30, 20, 20, 20, 20, 20]);
    }
}

export class CreateEventCommand extends EventCommand {
    async execute(): Promise<void> {
         const name: string = await input("Введите название: ");
         const date: Date = new Date(await input("Введите дату и время начала мероприятия: "));
         const hall: ID = Number(await input("Введите ID зала: "));
         const coach: ID = Number(await input("Введите ID тренера: "));
         const duration: number = Number(await input("Введите продолжительность: "));
         const capacity: number = Number(await input("Введите вместимость: "));

         await this._EventManager.create(this._person, date, hall, coach, duration, name, capacity);
    }
}

export class RefractEventCommand extends EventCommand {
    async execute(): Promise<void> {
        const id: ID = Number(await input(`Введите id мероприятия: `));
        const comm: Number = Number(await input(`Введите цифру поля для изменения: 
        1. Название
        2. Тренер
        3. Зал
        4. Вместимость
        5. Дата и время
        6. Продолжительность\n`));

        let val: string = await input(`Введите новое значение: `);
        let num: number = 0;
        let date: Date = new Date();

        if (comm === 2 || comm === 3 || comm === 4 || comm === 6) {
            num = Number(val);
        }
        else if (comm === 5) date = new Date(val);

        switch (comm) {
            case 1:
                let c1: EventUpdate = {field: EventField.NAME, value: val};
                await this._EventManager.change_event_field(this._person, id, c1);
                break;
            case 2:
                let c2: EventUpdate = {field: EventField.COACH, value: num};
                await this._EventManager.change_event_field(this._person, id, c2);
                break;
            case 3:
                let c3: EventUpdate = {field: EventField.HALL, value: num};
                await this._EventManager.change_event_field(this._person, id, c3);
                break;
            case 4:
                let c4: EventUpdate = {field: EventField.CAPACITY, value: num};
                await this._EventManager.change_event_field(this._person, id, c4);
                break;
            case 5:
                let c5: EventUpdate = {field: EventField.DATETIME, value: date};
                await this._EventManager.change_event_field(this._person, id, c5);
                break;
            case 6:
                let c6: EventUpdate = {field: EventField.DURATION, value: num};
                await this._EventManager.change_event_field(this._person, id, c6);
                break;
        }
    }
}

export class DeleteEventCommand extends EventCommand {
    async execute(): Promise<void> {
        const id: ID = Number(await input(`Введите id мероприятия: `));

        await this._EventManager.delete(this._person, id);
    }
}

export class ShowCoachTrainingsCommand extends EventCommand {
    async execute(): Promise<void> {
        let id: ID = this._person.id;

        if (this._person.role == Roles.admin) {
            id = Number(await input(`Введите id тренера: `));
        }

        const start: OnlyDate = await input("Введите дату начала в формате ГГГГ-ММ-ДД " +
            "(или оставьте пустым для получения только актуальных): ") as OnlyDate;
        const end: OnlyDate = await input("Введите дату конца в формате ГГГГ-ММ-ДД " +
            "(или оставьте пустым для получения только актуальных): ") as OnlyDate;

        let ev: AnySign[];

        if (!start.length) {
            ev = <AnySign[]>await this._CoachManager.
            show_trainings_by_period(this._person, id);
        }
        else {
            ev = <AnySign[]>await this._CoachManager.
            show_trainings_by_period(this._person, id, start, end);
        }

        ShowTable.show(ev, ['ID', 'Дата', 'Зал', 'Продолжительность', 'Клиент', 'Описание', 'Название', 'Администратор'],
            ["id", "date", "hall", "duration", "client", "info", "name", "admin"],
            [5, 30, 20, 10, 20, 20, 30, 20]);
    }
}

export class ShowAvailableEventsCommand extends EventCommand {
    async execute(): Promise<void> {
        const res: AnySign[] = <AnySign[]>await this._EventManager.show_available_events(this._person);

        ShowTable.show(
            res,
            ["ID", "Название", "Дата", "Зал", "Тренер", "Продолжительность"],
            ["id", "name", "date", "hall", "coach", "duration"],
            [5, 25, 30, 20, 40, 20]
        )
    }
}

export class RegistrateOnEventCommand extends EventCommand {
    async execute(): Promise<void> {
        const id: ID = Number(await input(`Введите id мероприятия: `));
        await this._EventManager.registration(this._person, id);
    }
}

export class UnregistrateOnEventCommand extends EventCommand {
    async execute(): Promise<void> {
        const id: ID = Number(await input(`Введите id мероприятия: `));
        await this._EventManager.un_registration(this._person, id);
    }
}

export class ShowClientSignsCommand extends EventCommand {
    async execute(): Promise<void> {
        const start: OnlyDate = await input("Введите дату начала в формате ГГГГ-ММ-ДД " +
            "(или оставьте пустым для получения только актуальных): ") as OnlyDate;
        const end: OnlyDate = await input("Введите дату конца в формате ГГГГ-ММ-ДД " +
            "(или оставьте пустым для получения только актуальных): ") as OnlyDate;

        let ev: AnySign[];

        if (!start.length) {
            ev = <AnySign[]>await this._ClientManager.show_signs_by_period(this._person);
        }
        else {
            ev = <AnySign[]>await this._ClientManager.show_signs_by_period(this._person, start, end);
        }

        ShowTable.show(ev, ['ID мероприятия', 'Дата', 'Зал', 'Продолжительность', 'Описание', 'Название'],
            ["id", "date", "hall", "duration", "info", "name"],
            [15, 25, 20, 20, 30, 30]);
    }
}