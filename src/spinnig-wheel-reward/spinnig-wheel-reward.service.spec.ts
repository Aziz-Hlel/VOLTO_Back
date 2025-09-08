import { Test, TestingModule } from '@nestjs/testing';
import { SpinnigWheelRewardService } from './spinnig-wheel-reward.service';

describe('SpinnigWheelRewardService', () => {
  let service: SpinnigWheelRewardService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SpinnigWheelRewardService],
    }).compile();

    service = module.get<SpinnigWheelRewardService>(SpinnigWheelRewardService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
