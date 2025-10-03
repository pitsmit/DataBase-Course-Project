import {ICoachScheduleManager} from "@services/CoachScheduleManager";
import {IEventManager} from "@services/EventManager";
import {IHallManager} from "@services/HallManager";
import {IPersonalTrainingManager} from "@services/PersonalTrainingManager";
import {IPersonDynamicManager} from "@services/PersonDynamicManager";
import {IAdminManager, IClientManager, ICoachManager} from "@services/PersonManager";

export abstract class Command {
    protected _CoachScheduleManager!: ICoachScheduleManager;
    protected _EventManager!: IEventManager;
    protected _HallManager!: IHallManager;
    protected _PersonalTrainingManager!: IPersonalTrainingManager;
    protected _PersonDynamicManager!: IPersonDynamicManager;
    protected _ClientManager!: IClientManager;
    protected _CoachManager!: ICoachManager;
    protected _AdminManager!: IAdminManager;

    setManagers(
        _CoachScheduleManager: ICoachScheduleManager,
        _EventManager: IEventManager,
        _HallManager: IHallManager,
        _PersonalTrainingManager: IPersonalTrainingManager,
        _PersonDynamicManager: IPersonDynamicManager,
        _ClientManager: IClientManager,
        _CoachManager: ICoachManager,
        _AdminManager: IAdminManager): void {

        this._CoachScheduleManager = _CoachScheduleManager;
        this._EventManager = _EventManager;
        this._HallManager = _HallManager;
        this._PersonalTrainingManager = _PersonalTrainingManager;
        this._PersonDynamicManager = _PersonDynamicManager;
        this._ClientManager = _ClientManager;
        this._CoachManager = _CoachManager;
        this._AdminManager = _AdminManager;
    }

    async execute(): Promise<void> {}
}

