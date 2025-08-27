import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigModule } from 'src/config/config.module';
import { WorkersModule } from 'src/workers/workers.module';
import { AuthModule } from 'src/auth/auth.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { StorageModule } from 'src/storage/storage.module';
import { UsersModule } from 'src/users/users.module';


@Module({
  imports: [AppConfigModule, PrismaModule, UsersModule, AuthModule, WorkersModule, StorageModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
