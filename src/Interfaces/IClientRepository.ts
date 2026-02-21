import {Person} from "@essences/person";
import {ID, OnlyDate} from "@essences/Types";
import {BaseEvent} from "@essences/Event";

export interface IClientRepository {
    get(login: string, password: string, token: string): Promise<Person>;
    create(login: string, password: string, name: string, surname: string): Promise<Person>;
    delete(login: string): Promise<void>;
    get_all(): Promise<Person[]>;
    get_signs(client: ID, from?: OnlyDate, to?: OnlyDate): Promise<BaseEvent[]>;
}