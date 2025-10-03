import {ID} from "@essences/Types";

export class Person {
    constructor(
        private readonly _id: ID,
        private readonly _name: string,
        private readonly _surname: string,
        private readonly _login: string,
        private readonly _role: number,
        private readonly _token?: string
    ) {}

    get name() { return this._name; }
    get surname() { return this._surname; }
    get token() { return this._token; }
    get login() { return this._login; }
    get  role() { return this._role; }
    get  id() { return this._id; }
}