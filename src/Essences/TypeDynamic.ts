export class TypeDynamic {
    constructor(private readonly _id: number,
                private readonly _name: string,
                private readonly _unit: string,) {
    }

    get id(): number { return this._id; }
    get name(): string { return this._name; }
    get unit(): string { return this._unit; }
}