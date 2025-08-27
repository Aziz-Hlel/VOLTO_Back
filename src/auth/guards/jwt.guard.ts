import { AuthGuard as JwtAuthGuard } from '@nestjs/passport';
export class JwtAccessGuard extends JwtAuthGuard('jwt') { }
