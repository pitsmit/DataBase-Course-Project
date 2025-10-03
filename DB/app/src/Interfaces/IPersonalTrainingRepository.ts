import {ID} from "@essences/Types";
import {Roles} from "@essences/Roles";

export interface IPersonalTrainingRepository {
    create(client_login: string, coach: ID, date: Date, hall: ID, duration: number, info?: string): Promise<void>;
    delete(person: ID, role: Roles, training: ID): Promise<void>;
    move(coach: ID, training: ID, date: Date): Promise<void>;
    change_duration(coach: ID, training: ID, duration: number): Promise<void>;
    add_info(coach: ID, training: ID, info: string): Promise<void>;
}