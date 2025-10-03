import {AnySign, StandartEvent} from "@essences/Event";
import {EventUpdate, ID, OnlyDate} from "@essences/Types";

export interface IEventsRepository {
    create(admin: ID, date: Date, hall: ID, coach: ID, duration: number,
           name: string, capacity: number): Promise<StandartEvent>;
    delete(training: ID): Promise<void>;

    update_event_field(training: ID, update: EventUpdate): Promise<void>;

    show_events(start?: OnlyDate, stop?: OnlyDate): Promise<StandartEvent[]>;

    show_available_events(): Promise<AnySign[]>;
    registrate(client: ID, training: ID): Promise<void>;
    un_registrate(client: ID, training: ID): Promise<void>;
}