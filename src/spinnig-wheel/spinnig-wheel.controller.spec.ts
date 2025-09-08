import { Test, TestingModule } from '@nestjs/testing';
import { SpinnigWheelController } from './spinnig-wheel.controller';
import { SpinnigWheelService } from './spinnig-wheel.service';

describe('SpinnigWheelController', () => {
  let controller: SpinnigWheelController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SpinnigWheelController],
      providers: [SpinnigWheelService],
    }).compile();

    controller = module.get<SpinnigWheelController>(SpinnigWheelController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
