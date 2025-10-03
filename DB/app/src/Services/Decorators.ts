import {Person} from "@essences/person";
import {Roles} from "@essences/Roles";

class RoleAccessDecorator {
    constructor() {}

    protect(allowedRoles: Roles | Roles[]) {
        const roles: Roles[] = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];

        return (
            _target: any,
            _propertyKey: string,
            descriptor: PropertyDescriptor
        ): PropertyDescriptor => {
            const originalMethod = descriptor.value;

            descriptor.value = async function (...args: any[]) {
                const user: Person = args[0];

                if (!roles.includes(user.role)) {
                    const requiredRoles = roles.map(r => Roles[r]).join(" или ");
                    throw new Error(
                        `Пользователь ${user.login}: недостаточно прав. ` +
                        `Требуется роль: ${requiredRoles}`
                    );
                }

                return originalMethod.apply(this, args);
            };

            return descriptor;
        };
    }
}

export const AdminOnly = () => new RoleAccessDecorator().protect(Roles.admin);
export const ClientOnly = () => new RoleAccessDecorator().protect(Roles.client);
export const CoachOnly = () => new RoleAccessDecorator().protect(Roles.coach);
export const AdminOrClient = () => new RoleAccessDecorator().protect([Roles.admin, Roles.client]);
export const CoachOrClient = () => new RoleAccessDecorator().protect([Roles.coach, Roles.client]);
export const AdminOrCoach = () => new RoleAccessDecorator().protect([Roles.admin, Roles.coach]);