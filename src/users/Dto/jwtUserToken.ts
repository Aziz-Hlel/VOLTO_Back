import { Role } from "generated/prisma";




export class jwtUserToken {
    sub: string;
    email: string;
    username: string;
    role: Role;
}