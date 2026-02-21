import {IClientDynamicRepository} from "@interfaces/IClientDynamicRepository";
import {inject, injectable} from "inversify";
import {IDBconnection} from "@repository/DBconnection";
import {QueryResult} from "pg";
import {TypeDynamic} from "@essences/TypeDynamic";
import {ID, OnlyDate} from "@essences/Types";
import {ClientDynamicRecord} from "@essences/ClientDynamicRecord";
import {Roles} from "@essences/Roles";
import {AllowedRoles} from "@repository/DBDecorator";

@injectable()
export class ClientDynamicRepository implements IClientDynamicRepository {
    constructor(
        @inject("IDBconnection") private DB: IDBconnection
    ) {}

    @AllowedRoles(Roles.client)
    async create_record(client: ID, type_dynamic: ID, d_date: OnlyDate, d_value: number): Promise<void> {
        const query = `INSERT INTO clientdynamic(clientid, dynamictypeid, value, date) 
                       VALUES ($1, $2, $3, $4)`

        await this.DB.query(query, [client, type_dynamic, d_value, d_date]);
    }

    @AllowedRoles(Roles.client)
    async delete_record(record: ID, client: ID): Promise<void> {
        const query = `DELETE from clientdynamic where id = $1 AND clientid = $2`;
        await this.DB.query(query, [record, client]);
    }

    @AllowedRoles(Roles.client)
    async get_records(client: ID, type_dynamic: ID, page: number = 1, limit: number = 10): Promise<ClientDynamicRecord[]> {
        const offset: number = (page - 1) * limit;
        const query = `SELECT * from clientdynamic where (ClientID, DynamicTypeID) = ($1, $2) 
                       ORDER BY date DESC LIMIT $3 OFFSET $4`;
        const res: QueryResult = await this.DB.query(query, [client, type_dynamic, limit, offset]);

        return Array.from(res.rows, x =>
            new ClientDynamicRecord(x.id, x.date.toLocaleString(), x.value)
        );
    }

    @AllowedRoles(Roles.admin)
    async add_type(type: string, unit: string): Promise<void> {
        const query = `
                    INSERT INTO clientdynamictypes (name, unit)
                    SELECT $1::text, $2::text
                    WHERE NOT EXISTS (
                        SELECT 1 FROM clientdynamictypes WHERE name = $1::text
                    )
                    RETURNING id`;

        await this.DB.query(query, [type, unit]);
    }

    @AllowedRoles(Roles.admin)
    async delete_type(id: ID): Promise<void> {
        const query = `DELETE FROM clientdynamictypes WHERE ID = $1`;
        await this.DB.query(query, [id]);
    }

    @AllowedRoles(Roles.client, Roles.admin)
    async get_types(_role: Roles): Promise<TypeDynamic[]> {
        const query = `SELECT * FROM clientdynamictypes`;
        const result: QueryResult = await this.DB.query(query, []);
        return Array.from(result.rows, x => new TypeDynamic(x.id, x.name, x.unit));
    }
}