import {inject} from "inversify";
import {IEventsRepository} from "@interfaces/IEventsRepository";
import {Person} from "@essences/person";
import {AnySign, StandartEvent} from "@essences/Event";
import {AdminOnly, ClientOnly} from "@services/Decorators";
import {EventUpdate, ID, OnlyDate} from "@essences/Types";

export interface IEventManager {
    create(_admin: Person, date: Date, hall: ID, coach: ID, duration: number,
           name: string, capacity: number): Promise<StandartEvent>;
    delete(_admin: Person, training_id: number): Promise<void>;
    change_event_field(_admin: Person, training: ID, field: EventUpdate): Promise<void>;

    show_events(_admin: Person, start?: OnlyDate, stop?: OnlyDate): Promise<StandartEvent[]>

    show_available_events(_client: Person): Promise<AnySign[]>;
    registration(client: Person, training_id: number): Promise<void>;
    un_registration(client: Person, training_id: number): Promise<void>;
}

export class EventManager implements IEventManager {
    constructor(@inject("IEventsRepository") private _eventRepository: IEventsRepository) {
    }

    @AdminOnly()
    async create(_admin: Person, date: Date, hall: ID, coach: ID, duration: number,
                 name: string, capacity: number): Promise<StandartEvent> {
        return await this._eventRepository.create(_admin.id, date, hall, coach, duration, name, capacity);
    }

    @AdminOnly()
    async delete(_admin: Person, training: ID): Promise<void> {
        await this._eventRepository.delete(training);
    }

    @AdminOnly()
    async change_event_field(_admin: Person, training: ID, field: EventUpdate): Promise<void> {
        await this._eventRepository.update_event_field(training, field);
    }

    @AdminOnly()
    async show_events(_admin: Person, start?: OnlyDate, stop?: OnlyDate): Promise<StandartEvent[]> {
        return await this._eventRepository.show_events(start, stop);
    }

    @ClientOnly()
    async show_available_events(_client: Person): Promise<AnySign[]> {
        return await this._eventRepository.show_available_events();
    }

    @ClientOnly()
    async registration(client: Person, training: ID): Promise<void> {
        await this._eventRepository.registrate(client.id, training);
    }

    @ClientOnly()
    async un_registration(client: Person, training: ID): Promise<void> {
        await this._eventRepository.un_registrate(client.id, training);
    }
}