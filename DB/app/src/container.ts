import "reflect-metadata";
import {Container} from "inversify";
import {AdminManager, ClientManager, CoachManager} from "@services/PersonManager";
import {AuthService} from "@services/AuthService";
import {ClientRepository} from "@repository/ClientRepository";
import {DBconnection} from "@repository/DBconnection";
import {CoachRepository} from "@repository/CoachRepository";
import {AdminRepository} from "@repository/AdminRepository";
import {ClientDynamicRepository} from "@repository/ClientDynamicRepository";
import {PersonDynamicManager} from "@services/PersonDynamicManager";
import {HallManager} from "@services/HallManager";
import {HallRepository} from "@repository/HallRepository";
import {CoachScheduleManager} from "@services/CoachScheduleManager";
import {CoachScheduleRepository} from "@repository/CoachScheduleRepository";
import {PersonalTrainingRepository} from "@repository/PersonalTrainingRepository";
import {PersonalTrainingManager} from "@services/PersonalTrainingManager";
import {EventManager} from "@services/EventManager";
import {EventsRepository} from "@repository/EventsRepository";
import {PersonFabric} from "@services/PersonFabric";
import {PersonRepository} from "@repository/PersonRepository";

export const container = new Container();

container.bind("IAuthService").to(AuthService).inSingletonScope();
container.bind("IDBconnection").to(DBconnection).inSingletonScope();

container.bind("IPersonRepository").to(PersonRepository).inSingletonScope();
container.bind("IClientRepository").to(ClientRepository).inSingletonScope();
container.bind("ICoachRepository").to(CoachRepository).inSingletonScope();
container.bind("IAdminRepository").to(AdminRepository).inSingletonScope();
container.bind("IClientDynamicRepository").to(ClientDynamicRepository).inSingletonScope();
container.bind("IHallRepository").to(HallRepository).inSingletonScope();
container.bind("ICoachScheduleRepository").to(CoachScheduleRepository).inSingletonScope();
container.bind("IPersonalTrainingRepository").to(PersonalTrainingRepository).inSingletonScope();
container.bind("IEventsRepository").to(EventsRepository).inSingletonScope();

container.bind("IPersonDynamicManager").to(PersonDynamicManager).inSingletonScope();
container.bind("IHallManager").to(HallManager).inSingletonScope();
container.bind("ICoachScheduleManager").to(CoachScheduleManager).inSingletonScope();
container.bind("IPersonalTrainingManager").to(PersonalTrainingManager).inSingletonScope();
container.bind("IEventManager").to(EventManager).inSingletonScope();

container.bind("IClientManager").to(ClientManager).inSingletonScope();
container.bind("ICoachManager").to(CoachManager).inSingletonScope();
container.bind("IAdminManager").to(AdminManager).inSingletonScope();

container.bind("IPersonFabric").to(PersonFabric).inSingletonScope();