import { Role } from "generated/prisma";



export class AuthUser {
    id: string;
    email: string;
    username: string;
    role: Role;
}