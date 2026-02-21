import {
    ShowAdminCasesCommand,
    ShowCasesCommand,
    ShowClientCasesCommand,
    ShowCoachCasesCommand, ShowVisitorCasesCommand
} from "@commands/ShowCasesCommands";
import {Facade} from "@facade/Facade";
import {Person} from "@essences/person";
import {
    AdminCommandFactory,
    ClientCommandFactory,
    CoachCommandFactory,
    ICommandFactory,
    VisitorCommandFactory
} from "@commands/CommandFabric";
import {Command} from "@commands/BaseCommand";
import {input} from "@front/iostream";
import {EntryCommand} from "@commands/EntryCommands";
import * as console from "node:console";

export abstract class Experience {
    protected abstract get showCasesCommand(): ShowCasesCommand;
    protected abstract get facade(): Facade;
    protected abstract get person(): Person;
    protected abstract get commandFactory(): ICommandFactory;

    protected constructor(
        protected readonly _facade: Facade,
        protected readonly _person: Person
    ) {}

    public async main(): Promise<void> {
        while (true) {
            await this.facade.execute(this.showCasesCommand);
            const caseNum: number = Number(await input("Введите номер действия: "));
            const command: Command|null = this.commandFactory.createCommand(caseNum, this.person);

            if (command) {
                try {
                    await this.facade.execute(command);
                }
                catch (e: any) {
                    console.error(e.message);
                }
            }
        }
    }
}

export class AdminExperience extends Experience {
    private readonly _showCasesCmd: ShowAdminCasesCommand;
    private readonly _commandFactory: ICommandFactory;

    constructor(facade: Facade, person: Person) {
        super(facade, person);
        this._showCasesCmd = new ShowAdminCasesCommand();
        this._commandFactory = new AdminCommandFactory();
    }

    protected get showCasesCommand(): ShowAdminCasesCommand {
        return this._showCasesCmd;
    }

    protected get commandFactory(): ICommandFactory {
        return this._commandFactory;
    }

    protected get facade(): Facade {
        return this._facade;
    }

    protected get person(): Person {
        return this._person;
    }
}

export class ClientExperience extends Experience {
    private readonly _showCasesCmd: ShowClientCasesCommand;
    private readonly _commandFactory: ICommandFactory;

    constructor(facade: Facade, person: Person) {
        super(facade, person);
        this._showCasesCmd = new ShowClientCasesCommand();
        this._commandFactory = new ClientCommandFactory();
    }

    protected get showCasesCommand(): ShowClientCasesCommand {
        return this._showCasesCmd;
    }

    protected get commandFactory(): ICommandFactory {
        return this._commandFactory;
    }

    protected get facade(): Facade {
        return this._facade;
    }

    protected get person(): Person {
        return this._person;
    }
}

export class CoachExperience extends Experience {
    private readonly _showCasesCmd: ShowCoachCasesCommand;
    private readonly _commandFactory: ICommandFactory;

    constructor(facade: Facade, person: Person) {
        super(facade, person);
        this._showCasesCmd = new ShowCoachCasesCommand();
        this._commandFactory = new CoachCommandFactory();
    }

    protected get showCasesCommand(): ShowCoachCasesCommand {
        return this._showCasesCmd;
    }

    protected get commandFactory(): ICommandFactory {
        return this._commandFactory;
    }

    protected get facade(): Facade {
        return this._facade;
    }

    protected get person(): Person {
        return this._person;
    }
}

export class VisitorExperience extends Experience {
    private readonly _showCasesCmd: ShowVisitorCasesCommand;
    private readonly _commandFactory: ICommandFactory;

    constructor(facade: Facade, person: Person) {
        super(facade, person);
        this._showCasesCmd = new ShowVisitorCasesCommand();
        this._commandFactory = new VisitorCommandFactory();
    }

    protected get facade(): Facade {
        return this._facade;
    }

    protected get person(): Person {
        return this._person;
    }

    public async main(): Promise<void> {
        let command: Command|null;
        let caseNum: number;
        while (true) {
            await this.facade.execute(new ShowVisitorCasesCommand());
            caseNum = Number(await input("Введите номер действия: "));
            command = new VisitorCommandFactory().createCommand(caseNum);

            if (command) {
                try {
                    await this.facade.execute(command);
                    if (caseNum > 0)  {
                        break;
                    }
                }
                catch (e: any) {
                    console.error(e.message);
                }
            }
        }

        const person: Person = (command as EntryCommand).person;

        if (caseNum === 1) await new ClientExperience(this.facade, person).main();
        else if (caseNum === 2) await new CoachExperience(this.facade, person).main();
        else if (caseNum === 3) await new AdminExperience(this.facade, person).main();
    }

    protected get commandFactory(): ICommandFactory {
        return this._commandFactory;
    }

    protected get showCasesCommand(): ShowCasesCommand {
        return this._showCasesCmd;
    }
}