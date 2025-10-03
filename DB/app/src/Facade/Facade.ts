import {container} from "@index/container";
import {ICoachScheduleManager} from "@services/CoachScheduleManager";
import {IEventManager} from "@services/EventManager";
import {IHallManager} from "@services/HallManager";
import {IPersonalTrainingManager} from "@services/PersonalTrainingManager";
import {IPersonDynamicManager} from "@services/PersonDynamicManager";
import {IAdminManager, IClientManager, ICoachManager} from "@services/PersonManager";
import {Command} from "@commands/BaseCommand";

export class Facade {
    private readonly _CoachScheduleManager: ICoachScheduleManager = container.get<ICoachScheduleManager>("ICoachScheduleManager");
    private readonly _EventManager: IEventManager = container.get<IEventManager>("IEventManager");
    private readonly _HallManager: IHallManager = container.get<IHallManager>("IHallManager");
    private readonly _PersonalTrainingManager: IPersonalTrainingManager = container.get<IPersonalTrainingManager>("IPersonalTrainingManager");
    private readonly _PersonDynamicManager: IPersonDynamicManager = container.get<IPersonDynamicManager>("IPersonDynamicManager");
    private readonly _ClientManager: IClientManager = container.get<IClientManager>("IClientManager");
    private readonly _CoachManager: ICoachManager = container.get<ICoachManager>("ICoachManager");
    private readonly _AdminManager: IAdminManager = container.get<IAdminManager>("IAdminManager");

    async execute(command: Command): Promise<void> {
        command.setManagers(
            this._CoachScheduleManager,
            this._EventManager,
            this._HallManager,
            this._PersonalTrainingManager,
            this._PersonDynamicManager,
            this._ClientManager,
            this._CoachManager,
            this._AdminManager,
        )

        await command.execute();
    }
}