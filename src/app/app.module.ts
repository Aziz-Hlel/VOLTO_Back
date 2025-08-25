import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigModule } from 'src/config/config.module';
import { WorkersModule } from 'src/workers/workers.module';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [AppConfigModule, PrismaModule, AuthModule, WorkersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
