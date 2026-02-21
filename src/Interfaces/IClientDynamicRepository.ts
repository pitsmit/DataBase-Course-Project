import {ClientDynamicRecord} from "@essences/ClientDynamicRecord";
import {TypeDynamic} from "@essences/TypeDynamic";
import {ID, OnlyDate} from "@essences/Types";
import {Roles} from "@essences/Roles";

export interface IClientDynamicRepository {
    create_record(client: ID, type_dynamic: ID, d_date: OnlyDate, d_value: number): Promise<void>;
    delete_record(record: ID, client: ID): Promise<void>;
    get_records(client: ID, type_dynamic: ID, page?: number, limit?: number): Promise<ClientDynamicRecord[]>;

    add_type(type: string, unit: string): Promise<void>;
    delete_type(id: ID): Promise<void>;
    get_types(role: Roles): Promise<TypeDynamic[]>;
}