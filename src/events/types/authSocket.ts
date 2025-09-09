import { Socket } from 'socket.io';
import { AuthUser } from 'src/users/Dto/AuthUser';

export type authSocket = Socket & { user: AuthUser };
