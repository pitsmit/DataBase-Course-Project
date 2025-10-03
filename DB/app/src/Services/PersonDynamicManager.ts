import {ClientDynamicRecord} from "@essences/ClientDynamicRecord";
import {inject} from "inversify";
import {IClientDynamicRepository} from "@interfaces/IClientDynamicRepository";
import {Person} from "@essences/person";
import {TypeDynamic} from "@essences/TypeDynamic";
import {AdminOnly, AdminOrClient, ClientOnly} from "@services/Decorators";
import {ID, OnlyDate} from "@essences/Types";

export interface IPersonDynamicManager {
    show_concrete_dynamic(_client: Person, type_dynamic: ID, page?: number, limit?: number):
        Promise<ClientDynamicRecord[]>;
    add_record(_client: Person, type_dynamic: ID, d_date: OnlyDate, d_value: number): Promise<void>;
    delete_record(_client: Person, record: ID): Promise<void>;

    add_type(_admin: Person, typename: string, unit: string): Promise<void>;
    delete_type(_admin: Person, type: ID): Promise<void>;
    show_types(_person: Person): Promise<TypeDynamic[]>;
}

export class PersonDynamicManager implements IPersonDynamicManager {
    constructor(@inject("IClientDynamicRepository") private _client_dynamic_repository: IClientDynamicRepository) {
    }

    @ClientOnly()
    async show_concrete_dynamic(_client: Person, type_dynamic: ID, page?: number, limit?: number):
        Promise<ClientDynamicRecord[]> {
        return await this._client_dynamic_repository.get_records(_client.id, type_dynamic, page, limit);
    }

    @ClientOnly()
    async add_record(_client: Person, type_dynamic: ID, d_date: OnlyDate, d_value: number): Promise<void> {
        await this._client_dynamic_repository.create_record(_client.id, type_dynamic, d_date, d_value);
    }

    @ClientOnly()
    async delete_record(_client: Person, record: ID): Promise<void> {
        await this._client_dynamic_repository.delete_record(record, _client.id);
    }

    @AdminOnly()
    async add_type(_admin: Person, typename: string, unit: string): Promise<void> {
        await this._client_dynamic_repository.add_type(typename, unit);
    }

    @AdminOnly()
    async delete_type(_admin: Person, type: ID): Promise<void> {
        await this._client_dynamic_repository.delete_type(type);
    }

    @AdminOrClient()
    async show_types(_person: Person): Promise<TypeDynamic[]> {
        return await this._client_dynamic_repository.get_types(_person.role);
    }
}