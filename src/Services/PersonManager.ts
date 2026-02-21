import {IClientRepository} from "@interfaces/IClientRepository";
import {inject} from "inversify";
import {IAuthService} from "@services/AuthService";
import {Person} from "@essences/person";
import {ICoachRepository} from "@interfaces/ICoachRepository";
import {IAdminRepository} from "@interfaces/IAdminRepository";
import {AdminOnly, AdminOrCoach, ClientOnly} from "@services/Decorators";
import {Roles} from "@essences/Roles";
import {ID, OnlyDate} from "@essences/Types";
import {BaseEvent} from "@essences/Event";
import {Specialization} from "@essences/Specialization";

export interface IClientManager {
    get(login: string, password: string): Promise<Person>;
    create(admin: Person, login: string, password: string, name: string, surname: string): Promise<Person>;
    delete(admin: Person, login: string): Promise<void>;
    show_all(_admin: Person): Promise<Person[]>;
    show_signs_by_period(_client: Person, from?: OnlyDate, to?: OnlyDate): Promise<BaseEvent[]>;
}

export class ClientManager implements IClientManager {
    constructor(@inject("IClientRepository") private _client_repository: IClientRepository,
                @inject("IAuthService") private _authService: IAuthService) {
    }

    async get(login: string, password: string): Promise<Person> {
        const token: string = this._authService.generateToken(login, Roles.client);
        return await this._client_repository.get(login, password, token);
    }

    @AdminOnly()
    async create(_admin: Person, login: string, password: string, name: string, surname: string): Promise<Person> {
        return await this._client_repository.create(login, password, name, surname);
    }

    @AdminOnly()
    async delete(_admin: Person, login: string): Promise<void> {
        return await this._client_repository.delete(login);
    }

    @AdminOnly()
    async show_all(_admin: Person): Promise<Person[]> {
        return await this._client_repository.get_all();
    }

    @ClientOnly()
    async show_signs_by_period(_client: Person, from?: OnlyDate, to?: OnlyDate): Promise<BaseEvent[]> {
        return await this._client_repository.get_signs(_client.id, from, to);
    }
}


export interface ICoachManager {
    get(login: string, password: string): Promise<Person>;
    create(admin: Person, login: string, password: string, name: string, surname: string): Promise<Person>;
    delete(admin: Person, login: string): Promise<void>;
    show_all(_admin: Person): Promise<Person[]>;
    add_specialization(admin: Person, coach_login: string, specialization: ID): Promise<void>;
    delete_specialization(admin: Person, coach_login: string, specialization: ID): Promise<void>;
    show_specializations_types(_admin: Person): Promise<Specialization[]>;
    show_coach_specializations(_admin: Person, coach_login: string): Promise<Specialization[]>;
    show_trainings_by_period(_person: Person, coach: ID, from?: OnlyDate, to?: OnlyDate): Promise<BaseEvent[]>;
}

export class CoachManager implements ICoachManager {
    constructor(@inject("ICoachRepository") private _coach_repository: ICoachRepository,
                @inject("IAuthService") private _authService: IAuthService) {
    }

    async get(login: string, password: string): Promise<Person> {
        const token: string = this._authService.generateToken(login, Roles.coach);
        return await this._coach_repository.get(login, password, token);
    }

    @AdminOnly()
    async create(_admin: Person, login: string, password: string, name: string, surname: string): Promise<Person> {
        return await this._coach_repository.create(login, password, name, surname);
    }

    @AdminOnly()
    async delete(_admin: Person, login: string): Promise<void> {
        return await this._coach_repository.delete(login);
    }

    @AdminOnly()
    async show_all(_admin: Person): Promise<Person[]> {
        return await this._coach_repository.get_all();
    }

    @AdminOnly()
    async add_specialization(_admin: Person, coach_login: string, specialization: ID): Promise<void> {
        await this._coach_repository.add_specialization(coach_login, specialization);
    }

    @AdminOnly()
    async delete_specialization(_admin: Person, coach_login: string, specialization: ID): Promise<void> {
        await this._coach_repository.delete_specialization(coach_login, specialization);
    }

    @AdminOnly()
    async show_specializations_types(_admin: Person): Promise<Specialization[]> {
        return await this._coach_repository.get_specialization_types();
    }

    @AdminOnly()
    async show_coach_specializations(_admin: Person, coach_login: string): Promise<Specialization[]> {
        return await this._coach_repository.get_specializations(coach_login);
    }

    @AdminOrCoach()
    async show_trainings_by_period(_person: Person, coach: ID, from?: OnlyDate, to?: OnlyDate): Promise<BaseEvent[]> {
        return await this._coach_repository.get_signs(_person.role, coach, from, to);
    }
}


export interface IAdminManager {
    get(login: string, password: string): Promise<Person>;
    create(admin: Person, login: string, password: string, name: string, surname: string): Promise<Person>;
    delete(removing_admin: Person, removable_admin_login: string): Promise<void>;
    show_all(_admin: Person): Promise<Person[]>;
}

export class AdminManager implements IAdminManager {
    constructor(@inject("IAdminRepository") private _admin_repository: IAdminRepository,
                @inject("IAuthService") private _authService: IAuthService) {
    }

    async get(login: string, password: string): Promise<Person> {
        const token: string = this._authService.generateToken(login, Roles.admin);
        return await this._admin_repository.get(login, password, token);
    }

    @AdminOnly()
    async create(_admin: Person, login: string, password: string, name: string, surname: string): Promise<Person> {
        return await this._admin_repository.create(login, password, name, surname);
    }

    @AdminOnly()
    async delete(_removing_admin: Person, removable_admin_login: string): Promise<void> {
        await this._admin_repository.delete(removable_admin_login);
    }

    @AdminOnly()
    async show_all(_admin: Person): Promise<Person[]> {
        return await this._admin_repository.get_all();
    }
}