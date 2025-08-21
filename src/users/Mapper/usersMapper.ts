import { User } from "generated/prisma";




export class UserMapper {
    // Convert full User DB object to API response
    static toResponse(user: User) {
        const { password, createdAt, updatedAt, ...result } = user; // exclude password
        return result;
    }

    static toTokenPayload(user: User) {
        return {
            sub: user.id,
            email: user.email,
            username: user.username,
            role: user.role
        };
    }

    
}