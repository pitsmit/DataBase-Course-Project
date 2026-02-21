import {Command} from "@commands/BaseCommand";
import {TypeDynamic} from "@essences/TypeDynamic";
import {Person} from "@essences/person";
import {input} from "@front/iostream";
import {ID, OnlyDate} from "@essences/Types";
import {ClientDynamicRecord} from "@essences/ClientDynamicRecord";
import {ShowTable} from "@commands/ShowTable";

export class DynamicTypesCommand extends Command {
    protected readonly _person: Person;

    constructor(person: Person) {
        super();
        this._person = person;
    }
}

export class ShowDynamicTypesCommand extends DynamicTypesCommand {
    async execute(): Promise<void> {
        const dyn: TypeDynamic[] = await this._PersonDynamicManager.show_types(this._person);

        ShowTable.show(dyn, ['ID', 'Название', 'Единица'], ["id", "name", "unit"], [5, 20, 20]);
    }
}

export class AddDynamicTypeCommand extends DynamicTypesCommand {
    async execute(): Promise<void> {
        const name: string = await input("Введите название статистики: ");
        const unit: string = await input("Введите единицу измерения: ");
        await this._PersonDynamicManager.add_type(this._person, name, unit);
        console.log("Тип статистики успешно добавлен");
    }
}

export class DeleteDynamicTypeCommand extends DynamicTypesCommand {
    async execute(): Promise<void> {
        const id: ID = Number(await input("Введите id удаляемой статистики: "));
        await this._PersonDynamicManager.delete_type(this._person, id);
        console.log("Тип статистики успешно удалён");
    }
}

export class AddRecordToDynamicCommand extends DynamicTypesCommand {
    async execute(): Promise<void> {
        const id: ID = Number(await input("Введите id типа статистики: "));
        const date: OnlyDate = await input("Введите дату в формате ГГГГ-ММ-ДД(или пропустите, будет сегодняшняя): ") as OnlyDate;
        const val: ID = Number(await input("Введите значение: "));
        await this._PersonDynamicManager.add_record(
            this._person,
            id,
            date.length ? date : (new Date()).toISOString().split('T')[0] as OnlyDate,
            val);
    }
}

export class ShowDynamicRecordsCommand extends DynamicTypesCommand {
    async execute(): Promise<void> {
        const id: ID = Number(await input("Введите id типа статистики: "));
        let page: number = 1;
        let limit: number = 10;
        let res: ClientDynamicRecord[] = [];
        let more: number;
        while (true) {
            res = await this._PersonDynamicManager.
            show_concrete_dynamic(this._person, id, page, limit);

            ShowTable.show(
                res,
                ['ID', 'Дата', 'Значение'],
                ["id", "date", "value"],
                [5, 20, 20]
            );

            more = Number(await input("Ещё? (1-да, 0-нет): "));
            if (!more) break;
            page++;
        }
    }
}

export class DeleteRecordToDynamicCommand extends DynamicTypesCommand {
    async execute(): Promise<void> {
        const id: ID = Number(await input("Введите id записи: "));
        await this._PersonDynamicManager.delete_record(this._person, id);
    }
}