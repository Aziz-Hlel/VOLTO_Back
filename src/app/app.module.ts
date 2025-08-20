import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AppConfigModule } from 'src/config/config.module';
import { PrismaModule } from 'src/prisma/prisma/prisma.module';
import { WorkersModule } from 'src/workers/workers.module';

@Module({
  imports: [AppConfigModule,PrismaModule,WorkersModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
