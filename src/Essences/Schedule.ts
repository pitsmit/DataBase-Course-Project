import {ID, OnlyDate, OnlyTime} from "@essences/Types";

export class Schedule {
    get id(): ID { return this._id; }
    get day(): OnlyDate { return this._day; }
    get start_time(): OnlyTime { return this._start_time; }
    get end_time(): OnlyTime { return this._end_time; }

    constructor(
        private readonly _id: ID,
        private readonly _day: OnlyDate,
        private readonly _start_time: OnlyTime,
        private readonly _end_time: OnlyTime
    ) {}
}