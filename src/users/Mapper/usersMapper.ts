import { User } from '@prisma/client';
import { jwtUserToken } from '../Dto/jwtUserToken';
import { UserResponseDto } from '../Dto/userResponse';

export class UserMapper {
  // Convert full User DB object to API response
  static toResponse(user: User): UserResponseDto {
    const { password, createdAt, updatedAt, ...result } = user; // exclude password
    return {
      ...result,
      phoneNumber: result.phoneNumber === null ? undefined : result.phoneNumber,
    };
  }

  static toTokenPayload(user: User): jwtUserToken {
    return {
      sub: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
    };
  }
}
