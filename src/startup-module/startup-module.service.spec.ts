import { Test, TestingModule } from '@nestjs/testing';
import { StartupModuleService } from './startup-module.service';

describe('StartupModuleService', () => {
  let service: StartupModuleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StartupModuleService],
    }).compile();

    service = module.get<StartupModuleService>(StartupModuleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
