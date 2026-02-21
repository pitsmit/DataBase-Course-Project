import {Command} from "@commands/BaseCommand";
import {ID} from "@essences/Types";
import {ShowTable} from "@commands/ShowTable";

class CaseLine {
    public id: ID;
    public name: string;

    constructor(id: ID, name: string) {
        this.id = id;
        this.name = name;
    }
}

export class ShowCasesCommand extends Command {
    get cases(): CaseLine[] {
        return this._cases;
    }

    protected readonly _cases: CaseLine[] = [];

    public async execute(): Promise<void> {
        ShowTable.show(this.cases, ['ID', 'Название'], ["id", "name"], [5, 100]);
    }
}

export class ShowAdminCasesCommand extends ShowCasesCommand {
    protected readonly _cases: CaseLine[] = [
        new CaseLine(0, `Выйти`),
        new CaseLine(1, `Список видов индивидуальных статистик клиентов`),
        new CaseLine(2, `Добавить вид индивидуальной статистики клиентов`),
        new CaseLine(3, `Удалить вид индивидуальной статистики клиентов`),
        new CaseLine(4, `Список залов`),
        new CaseLine(5, `Расписание конкретного зала`),
        new CaseLine(6, `Выставить расписание зала на конкретную дату`),
        new CaseLine(7, `Выставить расписание зала по умолчанию на период`),
        new CaseLine(8, `Список активных клиентов`),
        new CaseLine(9, `Список активных тренеров`),
        new CaseLine(10, `Список активных администраторов`),
        new CaseLine(11, `Добавить клиента`),
        new CaseLine(12, `Добавить тренера`),
        new CaseLine(13, `Добавить администратора`),
        new CaseLine(14, `Удалить клиента`),
        new CaseLine(15, `Удалить тренера`),
        new CaseLine(16, `Удалить администратора`),
        new CaseLine(17, `Список видов тренерских специализаций`),
        new CaseLine(18, `Список специализаций конкретного тренера`),
        new CaseLine(19, `Добавить специализацию тренеру`),
        new CaseLine(20, `Удалить специализацию у тренера`),
        new CaseLine(21, `Рабочие часы конкретного тренера`),
        new CaseLine(22, `Заполнить рабочие часы тренеру на конкретную дату`),
        new CaseLine(23, `Заполнить рабочие часы тренеру на неделю`),
        new CaseLine(24, `Список групповых мероприятий`),
        new CaseLine(25, `Создать групповое мероприятие`),
        new CaseLine(26, `Редактировать групповое мероприятие`),
        new CaseLine(27, `Удалить групповое мероприятие`),
        new CaseLine(28, `Список тренировок конкретного тренера`),
    ];
}

export class ShowClientCasesCommand extends ShowCasesCommand {
    protected readonly _cases: CaseLine[] = [
        new CaseLine(0, `Выйти`),
        new CaseLine(1, `Список видов индивидуальных статистик`),
        new CaseLine(2, `Добавить запись в статистику`),
        new CaseLine(3, `Просмотреть данные конкретной статистики`),
        new CaseLine(4, `Удалить запись в статистике`),
        new CaseLine(5, `Список доступных мероприятий`),
        new CaseLine(6, `Зарегистрироваться на мероприятие`),
        new CaseLine(7, `Отменить регистрацию на мероприятие`),
        new CaseLine(8, `Список записей`),
        new CaseLine(9, `Отменить персональную тренировку`),
    ];
}

export class ShowCoachCasesCommand extends ShowCasesCommand {
    protected readonly _cases: CaseLine[] = [
        new CaseLine(0, `Выйти`),
        new CaseLine(1, `Мои рабочие часы`),
        new CaseLine(2, `Заполнить рабочие часы на конкретную дату`),
        new CaseLine(3, `Заполнить рабочие часы на неделю`),
        new CaseLine(4, `Список моих тренировок`),
        new CaseLine(5, `Назначить индивидуальную тренировку`),
        new CaseLine(6, `Отменить персональную тренировку`),
        new CaseLine(7, `Перенести персональную тренировку`),
        new CaseLine(8, `Добавить информацию о персональной тренировке`),
        new CaseLine(9, `Изменить продолжительность персональной тренировки`),
        new CaseLine(10, `Список доступных мне залов для проведения персональных тренировок`),
    ];
}

export class ShowVisitorCasesCommand extends ShowCasesCommand {
    protected readonly _cases: CaseLine[] = [
        new CaseLine(0, `Выйти`),
        new CaseLine(1, `Войти как клиент`),
        new CaseLine(2, `Войти как тренер`),
        new CaseLine(3, `Войти как администратор`),
    ]
}