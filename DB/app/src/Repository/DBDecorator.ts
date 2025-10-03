import {Roles} from "@essences/Roles";
import {IDBconnection} from "@repository/DBconnection";
import {PoolClient} from "pg";

export function AllowedRoles(...allowedRoles: Roles[]) {
    return function(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value;

        descriptor.value = async function(this: { DB: IDBconnection }, ...args: any[]) {
            if (!this.DB) {
                throw new Error('DB connection is not initialized');
            }

            // 1. Получаем имена параметров метода
            const paramNames = getParamNames(originalMethod);

            // 2. Ищем параметр с типом Roles (используем комбинацию подходов)
            let roleParamIndex = -1;

            // Попробуем через метаданные
            const paramTypes = Reflect.getMetadata('design:paramtypes', target, propertyKey) || [];
            roleParamIndex = paramTypes.findIndex((t: any) => t === Roles);

            // Если через метаданные не нашли, попробуем по имени
            if (roleParamIndex === -1) {
                roleParamIndex = paramNames.findIndex(name =>
                    name === 'role' || name === '_role'
                );
            }

            // 3. Получаем роль из аргументов или используем дефолтную
            let finalRole: Roles;

            if (roleParamIndex >= 0 && args[roleParamIndex] !== undefined) {
                // Роль передана в аргументах
                finalRole = args[roleParamIndex];

                // Проверяем, что роль разрешена
                if (allowedRoles.length > 0 && !allowedRoles.includes(finalRole)) {
                    throw new Error(`Role ${finalRole} not allowed. Allowed roles: ${allowedRoles.join(', ')}`);
                }
            } else {
                // Используем первую разрешенную роль
                if (allowedRoles.length === 0) {
                    throw new Error(`No role specified for method ${propertyKey}`);
                }
                finalRole = allowedRoles[0];
            }

            const client: PoolClient = await this.DB.getClient(finalRole);
            try {
                return await originalMethod.apply(this, args);
            } finally {
                client.release();
            }
        };

        return descriptor;
    };
}

// Вспомогательная функция для получения имен параметров
function getParamNames(func: Function): string[] {
    const fnStr = func.toString();
    const paramStart = fnStr.indexOf('(') + 1;
    const paramEnd = fnStr.indexOf(')');
    const paramSection = fnStr.slice(paramStart, paramEnd);
    return paramSection.split(',').map(p => p.trim().replace(/\s.*$/, ''));
}