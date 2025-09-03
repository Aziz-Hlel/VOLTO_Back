import { Role } from "@prisma/client";



export class AuthUser  {
    id: string;
    email: string;
    username: string;
    role: Role;
}