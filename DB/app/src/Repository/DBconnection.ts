import {Pool, PoolClient} from "pg";
import {injectable} from "inversify";
import * as process from "node:process";
import {Roles} from "@essences/Roles";

export interface IDBconnection {
    pool: Pool;
    getClient(userRole: number): Promise<PoolClient>;
    query(query: string, args?: any[]): Promise<any>;
}

@injectable()
export class DBconnection implements IDBconnection {
    private readonly _pool: Pool;
    private _poolClient!: PoolClient;

    constructor() {
        this._pool = new Pool({
            user: process.env.USER,
            host: process.env.HOST,
            database: process.env.DATABASE_NAME,
            password: process.env.PASSWORD,
            port: Number(process.env.PORT),
        });
    }

    async getClient(userRole: number): Promise<PoolClient> {
        this._poolClient = await this._pool.connect();

        try {
            switch(userRole) {
                case Roles.admin:
                    await this._poolClient.query('SET ROLE app_admin');
                    break;
                case Roles.coach:
                    await this._poolClient.query('SET ROLE app_coach');
                    break;
                case Roles.client:
                    await this._poolClient.query('SET ROLE app_client');
            }

            return this._poolClient;
        } catch (error) {
            this._poolClient.release();
            throw error;
        }
    }

    async query(query: string, args?: any[]): Promise<any> {
        return await this._poolClient.query(query, args ? args : []);
    }

    get pool(): Pool {
        return this._pool;
    }
}

