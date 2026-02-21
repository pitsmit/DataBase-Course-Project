export type ID = number;
export type OnlyDate = `${number}-${number}-${number}`;
export type OnlyTime = `${number}:${number}:${number}`;

export enum EventField {
    NAME = 'name',
    COACH = 'coachid',
    HALL = 'hallid',
    CAPACITY = 'capacity',
    DATETIME = 'datetime',
    DURATION = 'duration'
}

export type EventUpdate =
    | { field: EventField.NAME; value: string }
    | { field: EventField.COACH; value: ID }
    | { field: EventField.HALL; value: ID }
    | { field: EventField.CAPACITY; value: number }
    | { field: EventField.DATETIME; value: Date }
    | { field: EventField.DURATION; value: number };

export enum Days {
    MONDAY = 1,
    TUESDAY = 2,
    WEDNESDAY = 3,
    THURSDAY = 4,
    FRIDAY = 5,
    SATURDAY = 6,
    SUNDAY = 7,
}