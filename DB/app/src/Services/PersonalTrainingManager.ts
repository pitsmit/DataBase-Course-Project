import {inject} from "inversify";
import {Person} from "@essences/person";
import {IPersonalTrainingRepository} from "@interfaces/IPersonalTrainingRepository";
import {ID} from "@essences/Types";
import {CoachOnly, CoachOrClient} from "@services/Decorators";

export interface IPersonalTrainingManager {
    create(_person: Person, client_login: string, date: Date, hall: ID, duration: number, info?: string): Promise<void>;
    delete(_person: Person, training: ID): Promise<void>;
    move(_person: Person, training: ID, date: Date): Promise<void>;
    change_duration(_person: Person, training: ID, duration: number): Promise<void>;
    add_info(person: Person, training: ID, info: string): Promise<void>;
}

export class PersonalTrainingManager implements IPersonalTrainingManager {
    constructor(@inject("IPersonalTrainingRepository") private _personalTrainingRepository: IPersonalTrainingRepository) {
    }

    @CoachOnly()
    async create(_person: Person, client_login: string, date: Date, hall: ID, duration: number, info?: string): Promise<void> {
        await this._personalTrainingRepository.create(client_login, _person.id, date, hall, duration, info);
    }

    @CoachOrClient()
    async delete(_person: Person, training: ID): Promise<void> {
        await this._personalTrainingRepository.delete(_person.id, _person.role, training);
    }

    @CoachOnly()
    async move(_person: Person, training: ID, date: Date): Promise<void> {
        await this._personalTrainingRepository.move(_person.id, training, date);
    }

    @CoachOnly()
    async change_duration(_person: Person, training: ID, duration: number): Promise<void> {
        await this._personalTrainingRepository.change_duration(_person.id, training, duration);
    }

    @CoachOnly()
    async add_info(_person: Person, training: ID, info: string): Promise<void> {
        await this._personalTrainingRepository.add_info(_person.id, training, info);
    }
}