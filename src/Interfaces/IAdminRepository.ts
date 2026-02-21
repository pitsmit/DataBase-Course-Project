import {Person} from "@essences/person";

export interface IAdminRepository {
    get(login: string, password: string, token: string): Promise<Person>;
    create(login: string, password: string, name: string, surname: string): Promise<Person>;
    delete(removable_admin_login: string): Promise<void>;
    get_all(): Promise<Person[]>;
}