import {inject} from "inversify";
import {IDBconnection} from "@repository/DBconnection";
import {IPersonFabric} from "@services/PersonFabric";
import {Person} from "@essences/person";
import {PoolClient, QueryResult} from "pg";
import * as bcrypt from "bcrypt";
import {Roles} from "@essences/Roles";
import {AnySign, BaseEvent, StandartEvent} from "@essences/Event";
import {AllowedRoles} from "@repository/DBDecorator";

export interface IPersonRepository {
    get(login: string, password: string, token: string, table: string, role: Roles): Promise<Person>;
    create(login: string, password: string, name: string, surname: string, table: string, role: Roles): Promise<Person>;
    delete(login: string, table: string): Promise<void>;
    generate_signs_arr(events: QueryResult, indivTrainings: QueryResult): any;
    get_all(table: string): Promise<Person[]>;
}

export class PersonRepository implements IPersonRepository {
    constructor(
        @inject("IDBconnection") private DB: IDBconnection,
        @inject("IPersonFabric") private _person_fabric: IPersonFabric,
    ) {}

    async get(login: string, password: string, token: string, table: string, role: Roles): Promise<Person> {
        const client: PoolClient = await this.DB.pool.connect();
        const query = `SELECT * FROM ${table} WHERE login = $1`
        const result: QueryResult = await client.query(query, [login]);
        client.release();

        if (result.rowCount) {
            const person: any = result.rows[0];
            if (await bcrypt.compare(password, person.password)) {
                if (!person.is_participate) {
                    throw new Error(`Пользователь ${login} ранее был удалён из системы`);
                }
                return this._person_fabric.create(person.id, person.name, person.surname, login, role, token);
            }
            throw new Error(`Неверный пароль`);
        }

        throw new Error(`Пользователь с логином ${login} не найден`);
    }

    @AllowedRoles(Roles.admin)
    async create(login: string, password: string, name: string, surname: string, table: string, person_role: Roles): Promise<Person> {
        const rz: QueryResult = await this.DB.query(`SELECT login FROM ${table} WHERE login = $1`, [login]);
        if (rz.rowCount) {
            throw new Error(`Логин ${login} занят`);
        }

        const saltRounds = 10;
        const hashedPassword: string = await bcrypt.hash(password, saltRounds);

        const query = `INSERT INTO ${table} (name, surname, login, password)
                       VALUES ($1, $2, $3, $4)
                       RETURNING id, name, surname, login`;

        const result: QueryResult = await this.DB.query(query, [name, surname, login, hashedPassword]);
        const person: any = result.rows[0];

        return this._person_fabric.create(person.id, person.name, person.surname, person.login, person_role);
    }

    @AllowedRoles(Roles.admin)
    async delete(login: string, table: string): Promise<void> {
        let query;
        if (table == "admin") {
            query = `UPDATE ${table} 
                    SET is_participate = false 
                    WHERE login = $1 
                    AND EXISTS (
                        SELECT 1 FROM ${table} 
                        WHERE is_participate = true 
                        AND login != $1
                    )`;
        }
        else {
            query = `UPDATE ${table}
                     SET is_participate = false
                     WHERE login = $1`;
        }

        await this.DB.query(query, [login]);
    }

    @AllowedRoles(Roles.admin)
    async get_all(table: string): Promise<Person[]> {
        const query = `SELECT id, name, surname, login FROM ${table} WHERE is_participate = true`;
        const result: QueryResult = await this.DB.query(query);
        return Array.from(result.rows, x => new Person(
            x.id,
            x.name,
            x.surname,
            x.login,
            -1));
    }

    private compareEventsByDateTime(a: BaseEvent, b: BaseEvent): number {
        const aa = a as StandartEvent;
        const bb = b as StandartEvent;
        const dateA = new Date(aa.date);
        const dateB = new Date(bb.date);
        return dateA.getTime() - dateB.getTime();
    }

    generate_signs_arr(events: QueryResult, indivTrainings: QueryResult) {
        const result = [
            ...events.rows.map(row => new AnySign(
                row.id,
                row.datetime,
                row.hall_name,
                row.coach_login ? row.coach_login : row.coach_name + " " + row.coach_surname,
                row.duration,
                "-",
                "-",
                row.name,
                row.capacity ? row.capacity : 0,
                row.admin_login ? row.admin_login : "-",
            )),
            ...indivTrainings.rows.map(row => new AnySign(
                row.id,
                row.datetime,
                row.hall_name,
                row.coach_login ? row.coach_login : row.coach_name + " " + row.coach_surname,
                row.duration,
                row.client_login ? row.client_login : "-",
                row.notes,
                "-",
                0,
                "-",
            ))
        ];

        return result.sort(this.compareEventsByDateTime);
    }
}