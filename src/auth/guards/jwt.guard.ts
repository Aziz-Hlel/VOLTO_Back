import { AuthGuard as JwtAuthGuard } from '@nestjs/passport';
export class AuthGuard extends JwtAuthGuard('jwt') { }
