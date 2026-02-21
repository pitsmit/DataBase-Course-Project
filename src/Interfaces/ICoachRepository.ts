import {Person} from "@essences/person";
import {ID, OnlyDate} from "@essences/Types";
import {BaseEvent} from "@essences/Event";
import {Specialization} from "@essences/Specialization";
import {Roles} from "@essences/Roles";

export interface ICoachRepository {
    get(login: string, password: string, token: string): Promise<Person>;
    create(login: string, password: string, name: string, surname: string): Promise<Person>;
    delete(login: string): Promise<void>;
    get_all(): Promise<Person[]>;
    add_specialization(login: string, specialization: ID): Promise<void>;
    delete_specialization(login: string, specialization: ID): Promise<void>;
    get_specialization_types(): Promise<Specialization[]>;
    get_specializations(login: string): Promise<Specialization[]>;
    get_signs(_role: Roles, coach: ID, from?: OnlyDate, to?: OnlyDate): Promise<BaseEvent[]>;
}