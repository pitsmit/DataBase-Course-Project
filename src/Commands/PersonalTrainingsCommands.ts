import {Command} from "@commands/BaseCommand";
import {Person} from "@essences/person";
import {ID} from "@essences/Types";
import {input} from "@front/iostream";

export class PersonalTrainingsCommand extends Command {
    protected readonly _person: Person;

    constructor(person: Person) {
        super();
        this._person = person;
    }
}

export class CreatePersonalTrainingCommand extends PersonalTrainingsCommand {
    async execute(): Promise<void> {
        const login: string = await input("Введите логин клиента: ");
        const date: Date = new Date(await input("Введите дату и время: "));
        const hall: ID = Number(await input("Введите ID зала: "));
        const duration: number = Number(await input("Введите продолжительность: "));
        const info: string = await input("Введите описание: ");

        if (info.length) {
            await this._PersonalTrainingManager.create(this._person, login, date, hall, duration, info);
        }
        else {
            await this._PersonalTrainingManager.create(this._person, login, date, hall, duration);
        }
    }
}

export class DeletePersonalTrainingCommand extends PersonalTrainingsCommand {
    async execute(): Promise<void> {
        const id: ID = Number(await input("Введите ID тренировки: "));

        await this._PersonalTrainingManager.delete(this._person, id);
    }
}

export class MovePersonalTrainingCommand extends PersonalTrainingsCommand {
    async execute(): Promise<void> {
        const id: ID = Number(await input("Введите ID тренировки: "));
        const date: Date = new Date(await input("Введите новые дату и время: "));

        await this._PersonalTrainingManager.move(this._person, id, date);
    }
}

export class AddInfoPersonalTrainingCommand extends PersonalTrainingsCommand {
    async execute(): Promise<void> {
        const id: ID = Number(await input("Введите ID тренировки: "));
        const info: string = await input("Введите описание тренировки: ");

        await this._PersonalTrainingManager.add_info(this._person, id, info);
    }
}

export class ChangeDurationPersonalTrainingCommand extends PersonalTrainingsCommand {
    async execute(): Promise<void> {
        const id: ID = Number(await input("Введите ID тренировки: "));
        const len: number = Number(await input("Введите продолжительность: "));

        await this._PersonalTrainingManager.change_duration(this._person, id, len);
    }
}