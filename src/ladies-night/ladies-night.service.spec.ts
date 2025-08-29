import { Test, TestingModule } from '@nestjs/testing';
import { LadiesNightService } from './ladies-night.service';

describe('LadiesNightService', () => {
  let service: LadiesNightService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LadiesNightService],
    }).compile();

    service = module.get<LadiesNightService>(LadiesNightService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
