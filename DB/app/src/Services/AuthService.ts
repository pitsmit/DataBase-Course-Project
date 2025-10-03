import {injectable} from "inversify";
import jwt from 'jsonwebtoken';
import * as process from "node:process";

export interface IAuthService {
    generateToken(login: string, role: number): string;
    verifyToken(token: string): { log: string; role: number };
}

@injectable()
export class AuthService implements IAuthService {
    generateToken(login: string, role: number): string {
        return jwt.sign(
            { log: login, role },
            process.env.JWT_SECRET || "",
            { expiresIn: '30d', algorithm: 'HS512' }
        );
    }

    verifyToken(token: string): { log: string; role: number } {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "");
        console.log(decoded);
        if (typeof decoded !== 'object' || decoded === null) {
            throw new Error("Invalid token");
        }

        if (!('log' in decoded) || !('role' in decoded)) {
            throw new Error('Token does not contain required field');
        }

        return { log: decoded.log, role: decoded.role };
    }
}