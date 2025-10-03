import {ID} from "@essences/Types";

export class Specialization {
    constructor(
        private readonly _id: ID,
        private readonly _name: string,
        private readonly _hall: ID,
    ) {}

    get name(): string { return this._name; }
    get  id(): ID { return this._id; }
    get  hall(): ID { return this._hall; }
}