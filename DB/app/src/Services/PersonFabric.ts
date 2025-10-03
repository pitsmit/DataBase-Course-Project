import {Person} from "@essences/person";
import {Roles} from "@essences/Roles";

export interface IPersonFabric {
    create(id: number, name: string, surname: string, login: string, role: Roles, token?: string): Person;
}

export class PersonFabric implements IPersonFabric {
    create(id: number, name: string, surname: string, login: string, role: Roles, token?: string): Person {
        return new Person(id, name, surname, login, role, token);
    }
}