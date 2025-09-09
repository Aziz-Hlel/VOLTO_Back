import { Test, TestingModule } from '@nestjs/testing';
import { SpinnigWheelRewardController } from './spinnig-wheel-reward.controller';
import { SpinnigWheelRewardService } from './spinnig-wheel-reward.service';

describe('SpinnigWheelRewardController', () => {
  let controller: SpinnigWheelRewardController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SpinnigWheelRewardController],
      providers: [SpinnigWheelRewardService],
    }).compile();

    controller = module.get<SpinnigWheelRewardController>(
      SpinnigWheelRewardController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
