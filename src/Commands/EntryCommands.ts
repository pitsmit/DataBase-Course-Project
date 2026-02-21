import {Command} from "@commands/BaseCommand";
import {Person} from "@essences/person";
import {input} from "@front/iostream";

export class EntryCommand extends Command {
    protected _person!: Person;
    protected _login!: string;
    protected _password!: string;

    async input_credentials(): Promise<void> {
        this._login = await input("Введите логин: ");
        this._password = await input("Введите пароль: ");
    }

    get person (): Person {
        return this._person;
    }
}

export class EntryAdmin extends EntryCommand {
    async execute(): Promise<void> {
        await this.input_credentials();
        this._person = await this._AdminManager.get(this._login, this._password);
    }
}

export class EntryCoach extends EntryCommand {
    async execute(): Promise<void> {
        await this.input_credentials();
        this._person = await this._CoachManager.get(this._login, this._password);
    }
}

export class EntryClient extends EntryCommand {
    async execute(): Promise<void> {
        await this.input_credentials();
        this._person = await this._ClientManager.get(this._login, this._password);
    }
}