import {Person} from "@essences/person";
import {Command} from "@commands/BaseCommand";
import {
    AddDynamicTypeCommand, AddRecordToDynamicCommand,
    DeleteDynamicTypeCommand, DeleteRecordToDynamicCommand, ShowDynamicRecordsCommand,
    ShowDynamicTypesCommand
} from "@commands/PersonDynamicCommands";
import {
    CreateEventCommand, DeleteEventCommand,
    RefractEventCommand, RegistrateOnEventCommand, ShowAvailableEventsCommand, ShowClientSignsCommand,
    ShowCoachTrainingsCommand,
    ShowEventsCommand, UnregistrateOnEventCommand
} from "@commands/EventCommands";
import {
    SetHallScheduleByDayCommand,
    SetHallScheduleStandartCommand, ShowAvailableCoachHallsCommand,
    ShowHallScheduleCommand,
    ShowHallsCommand
} from "@commands/HallCommands";
import {
    AddAdminCommand,
    AddClientCommand, AddCoachCommand, DeleteAdminCommand, DeleteClientCommand, DeleteCoachCommand,
    ShowAdminsCommand,
    ShowClientsCommand,
    ShowCoachesCommand
} from "@commands/ContingentCommands";
import {
    AddCoachSpecializationCommand, DeleteCoachSpecializationCommand,
    ShowCoachSpecializationsCommand,
    ShowSpecializationsCommand
} from "@commands/SpecializationCommands";
import {
    SetCoachScheduleByDayCommand,
    SetCoachScheduleForWeekCommand,
    ShowCoachScheduleCommand
} from "@commands/CoachScheduleCommands";
import {
    AddInfoPersonalTrainingCommand, ChangeDurationPersonalTrainingCommand,
    CreatePersonalTrainingCommand,
    DeletePersonalTrainingCommand,
    MovePersonalTrainingCommand
} from "@commands/PersonalTrainingsCommands";
import {EntryAdmin, EntryClient, EntryCoach} from "@commands/EntryCommands";
import {ExitCommand} from "@commands/ExitCommand";

export interface ICommandFactory {
    createCommand(caseNum: number, person: Person): Command | null;
}

export class AdminCommandFactory implements ICommandFactory {
    createCommand(caseNum: number, person: Person): Command | null {
        switch (caseNum) {
            case 0: return new ExitCommand();
            case 1: return new ShowDynamicTypesCommand(person);
            case 2: return new AddDynamicTypeCommand(person);
            case 3: return new DeleteDynamicTypeCommand(person);
            case 4: return new ShowHallsCommand(person);
            case 5: return new ShowHallScheduleCommand(person);
            case 6: return new SetHallScheduleByDayCommand(person);
            case 7: return new SetHallScheduleStandartCommand(person);
            case 8: return new ShowClientsCommand(person);
            case 9: return new ShowCoachesCommand(person);
            case 10: return new ShowAdminsCommand(person);
            case 11: return new AddClientCommand(person);
            case 12: return new AddCoachCommand(person);
            case 13: return new AddAdminCommand(person);
            case 14: return new DeleteClientCommand(person);
            case 15: return new DeleteCoachCommand(person);
            case 16: return new DeleteAdminCommand(person);
            case 17: return new ShowSpecializationsCommand(person);
            case 18: return new ShowCoachSpecializationsCommand(person);
            case 19: return new AddCoachSpecializationCommand(person);
            case 20: return new DeleteCoachSpecializationCommand(person);
            case 21: return new ShowCoachScheduleCommand(person);
            case 22: return new SetCoachScheduleByDayCommand(person);
            case 23: return new SetCoachScheduleForWeekCommand(person);
            case 24: return new ShowEventsCommand(person);
            case 25: return new CreateEventCommand(person);
            case 26: return new RefractEventCommand(person);
            case 27: return new DeleteEventCommand(person);
            case 28: return new ShowCoachTrainingsCommand(person);
            default: return null;
        }
    }
}

export class ClientCommandFactory implements ICommandFactory {
    createCommand(caseNum: number, person: Person): Command | null {
        switch (caseNum) {
            case 0: return new ExitCommand();
            case 1: return new ShowDynamicTypesCommand(person);
            case 2: return new AddRecordToDynamicCommand(person);
            case 3: return new ShowDynamicRecordsCommand(person);
            case 4: return new DeleteRecordToDynamicCommand(person);
            case 5: return new ShowAvailableEventsCommand(person);
            case 6: return new RegistrateOnEventCommand(person);
            case 7: return new UnregistrateOnEventCommand(person);
            case 8: return new ShowClientSignsCommand(person);
            case 9: return new DeletePersonalTrainingCommand(person);
            default: return null;
        }
    }
}

export class CoachCommandFactory implements ICommandFactory {
    createCommand(caseNum: number, person: Person): Command | null {
        switch (caseNum) {
            case 0: return new ExitCommand();
            case 1: return new ShowCoachScheduleCommand(person);
            case 2: return new SetCoachScheduleByDayCommand(person);
            case 3: return new SetCoachScheduleForWeekCommand(person);
            case 4: return new ShowCoachTrainingsCommand(person);
            case 5: return new CreatePersonalTrainingCommand(person);
            case 6: return new DeletePersonalTrainingCommand(person);
            case 7: return new MovePersonalTrainingCommand(person);
            case 8: return new AddInfoPersonalTrainingCommand(person);
            case 9: return new ChangeDurationPersonalTrainingCommand(person);
            case 10: return new ShowAvailableCoachHallsCommand(person);
            default: return null;
        }
    }
}

export class VisitorCommandFactory implements ICommandFactory {
    createCommand(caseNum: number): Command | null {
        switch (caseNum) {
            case 0: return new ExitCommand();
            case 1: return new EntryClient();
            case 2: return new EntryCoach();
            case 3: return new EntryAdmin();
            default: return null;
        }
    }
}