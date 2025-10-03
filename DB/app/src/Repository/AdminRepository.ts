import {IAdminRepository} from "@interfaces/IAdminRepository";
import {inject, injectable} from "inversify";
import {Person} from "@essences/person";
import {Roles} from "@essences/Roles";
import {IPersonRepository} from "@repository/PersonRepository";

@injectable()
export class AdminRepository implements IAdminRepository {
    private readonly base_table: string = "admin";

    constructor(
        @inject("IPersonRepository") private personRepository: IPersonRepository,
    ) {}

    async get(login: string, password: string, token: string): Promise<Person> {
        return this.personRepository.get(login, password, token, this.base_table, Roles.admin);
    }

    async create(login: string, password: string, name: string, surname: string): Promise<Person> {
        return this.personRepository.create(login, password, name, surname, this.base_table, Roles.admin);
    }

    async delete(login: string): Promise<void> {
        return this.personRepository.delete(login, this.base_table);
    }

    async get_all(): Promise<Person[]> {
        return this.personRepository.get_all(this.base_table);
    }
}