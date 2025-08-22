import { User } from "generated/prisma";
import { jwtUserToken } from "../Dto/jwtUserToken";
import { UserResponseDto } from "../Dto/userResponse";




export class UserMapper {
    // Convert full User DB object to API response
    static toResponse(user: User): UserResponseDto {
        const { password, createdAt, updatedAt, ...result } = user; // exclude password
        return result;
    }

    static toTokenPayload(user: User): jwtUserToken {
        return {
            sub: user.id,
            email: user.email,
            username: user.username,
            role: user.role
        };
    }



}