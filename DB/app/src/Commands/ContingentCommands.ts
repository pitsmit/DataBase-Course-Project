import {Command} from "@commands/BaseCommand";
import {Person} from "@essences/person";
import {input} from "@front/iostream";
import {ShowTable} from "@commands/ShowTable";

export class ContingentCommand extends Command {
    protected readonly _admin: Person;

    constructor(person: Person) {
        super();
        this._admin = person;
    }

    show_persons(persons: Person[]): void {
        ShowTable.show(persons, ['ID', 'Имя', 'Фамилия', 'Логин'], ["id", "name", "surname", "login"], [5, 20, 20, 20]);
    }
}

export class ShowClientsCommand extends ContingentCommand {
    async execute(): Promise<void> {
        const persons: Person[] = await this._ClientManager.show_all(this._admin);
        super.show_persons(persons);
    }
}

export class ShowCoachesCommand extends ContingentCommand {
    async execute(): Promise<void> {
        const persons: Person[] = await this._CoachManager.show_all(this._admin);
        super.show_persons(persons);
    }
}

export class ShowAdminsCommand extends ContingentCommand {
    async execute(): Promise<void> {
        const persons: Person[] = await this._AdminManager.show_all(this._admin);
        super.show_persons(persons);
    }
}

export class AddCommand extends ContingentCommand {
    async input_person_data() {
        console.log("Заполнение данных:");
        const name: string = await input("Введите имя: ");
        const surname: string = await input("Введите фамилию: ");
        const login: string = await input("Введите логин: ");
        const password: string = await input("Введите пароль: ");

        return {name, surname, login, password};
    }
}

export class AddClientCommand extends AddCommand {
    async execute(): Promise<void> {
        const {name, surname, login, password} = await super.input_person_data();
        await this._ClientManager.create(this._admin, login, password, name, surname);
    }
}

export class AddCoachCommand extends AddCommand {
    async execute(): Promise<void> {
        const {name, surname, login, password} = await super.input_person_data();
        await this._CoachManager.create(this._admin, login, password, name, surname);
    }
}

export class AddAdminCommand extends AddCommand {
    async execute(): Promise<void> {
        const {name, surname, login, password} = await super.input_person_data();
        await this._AdminManager.create(this._admin, login, password, name, surname);
    }
}

export class DeleteCommand extends ContingentCommand {
    async input_person_data() {
        console.log("Заполнение данных:");
        return await input("Введите логин: ");
    }
}

export class DeleteClientCommand extends DeleteCommand {
    async execute(): Promise<void> {
        const login: string = await super.input_person_data();
        await this._ClientManager.delete(this._admin, login);
    }
}

export class DeleteCoachCommand extends DeleteCommand {
    async execute(): Promise<void> {
        const login: string = await super.input_person_data();
        await this._CoachManager.delete(this._admin, login);
    }
}

export class DeleteAdminCommand extends DeleteCommand {
    async execute(): Promise<void> {
        const login: string = await super.input_person_data();
        await this._AdminManager.delete(this._admin, login);
    }
}