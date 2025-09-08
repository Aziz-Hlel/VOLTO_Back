import { Module } from '@nestjs/common';
import { StartupModuleService } from './startup-module.service';

@Module({
  providers: [StartupModuleService]
})
export class StartupModuleModule {}
