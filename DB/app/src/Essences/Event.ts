import {ID} from "@essences/Types";

export abstract class BaseEvent {}

export class AnySign extends BaseEvent {
    constructor(
        private readonly _id: ID,
        private readonly _date: Date,
        private readonly _hall: string,
        private readonly _coach: string,
        private readonly _duration: number,

        private readonly _client: string,
        private readonly _info: string = "",
        private readonly _name: string,
        private readonly _capacity: number,
        private readonly _admin: string
    ) {
        super();
    }

    get id(): ID { return this._id; }
    get client(): string { return this._client; }
    get info(): string { return this._info; }
    get name(): string { return this._name; }
    get date(): Date { return this._date; }
    get capacity(): number { return this._capacity; }
    get coach(): string { return this._coach; }
    get hall(): string { return this._hall; }
    get admin(): string { return this._admin; }
    get duration(): number { return this._duration; }
}

export class PersonalTraining extends BaseEvent {
    constructor(
        private readonly _id: ID,
        private readonly _date: Date,
        private readonly _hall: ID,
        private readonly _coach: ID,
        private readonly _duration: number,

        private readonly _client: ID,
        private readonly _info: string = ""
    ) {
        super();
    }

    get id(): ID { return this._id; }
    get date(): Date { return this._date; }
    get hall(): ID { return this._hall; }
    get coach(): ID { return this._coach; }
    get client(): ID { return this._client; }
    get duration(): number { return this._duration; }
    get info(): string { return this._info; }
}

export class StandartEvent extends BaseEvent {
    constructor(
        private readonly _id: ID,
        private readonly _date: Date,
        private readonly _hall: ID,
        private readonly _coach: ID,
        private readonly _duration: number,

        private readonly _name: string,
        private readonly _capacity: number,
        private readonly _admin: ID
    ) {
        super();
    }

    get id(): ID { return this._id; }
    get name(): string { return this._name; }
    get date(): Date { return this._date; }
    get capacity(): number { return this._capacity; }
    get coach(): ID { return this._coach; }
    get hall(): ID { return this._hall; }
    get admin(): ID { return this._admin; }
    get duration(): number { return this._duration; }
}