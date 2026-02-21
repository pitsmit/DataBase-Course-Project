import {ID, OnlyDate} from "@essences/Types";

export class ClientDynamicRecord {
    constructor(
        private readonly _id: ID,
        private readonly _date: OnlyDate,
        private readonly _value: number
    ) {}

    get id() { return this._id; }
    get date() { return this._date; }
    get value() { return this._value; }
}