import { Test, TestingModule } from '@nestjs/testing';
import { LadiesNightGateway } from './ladies-night.gateway';

describe('LadiesNightGateway', () => {
  let gateway: LadiesNightGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LadiesNightGateway],
    }).compile();

    gateway = module.get<LadiesNightGateway>(LadiesNightGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
