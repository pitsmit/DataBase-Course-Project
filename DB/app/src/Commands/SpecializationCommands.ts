import {Command} from "@commands/BaseCommand";
import {Specialization} from "@essences/Specialization";
import {Person} from "@essences/person";
import {input} from "@front/iostream";
import {ID} from "@essences/Types";
import {ShowTable} from "@commands/ShowTable";

export class SpecializationCommand extends Command{
    protected readonly _admin: Person;

    constructor(person: Person) {
        super();
        this._admin = person;
    }
}

export class ShowSpecializationsCommand extends SpecializationCommand {
    async execute(): Promise<void> {
        const res: Specialization[] = await this._CoachManager.show_specializations_types(this._admin);

        ShowTable.show(res, ['ID', 'Название', 'Зал проведения'], ["id", "name", "hall"], [5, 20, 20]);
    }
}

export class ShowCoachSpecializationsCommand extends SpecializationCommand {
    async execute(): Promise<void> {
        const login: string = await input("Введите логин тренера: ");
        const res: Specialization[] = await this._CoachManager.show_coach_specializations(this._admin, login);

        ShowTable.show(res, ['ID', 'Название', 'Зал проведения'], ["id", "name", "hall"], [5, 20, 20]);
    }
}

export class AddCoachSpecializationCommand extends SpecializationCommand {
    async execute(): Promise<void> {
        const login: string = await input("Введите логин тренера: ");
        const spec: ID = Number(await input("Введите id специализации: "));
        await this._CoachManager.add_specialization(this._admin, login, spec);
    }
}

export class DeleteCoachSpecializationCommand extends SpecializationCommand {
    async execute(): Promise<void> {
        const login: string = await input("Введите логин тренера: ");
        const spec: ID = Number(await input("Введите id специализации: "));
        await this._CoachManager.delete_specialization(this._admin, login, spec);
    }
}