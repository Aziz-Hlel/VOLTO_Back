import { Test, TestingModule } from '@nestjs/testing';
import { LadiesNightController } from './ladies-night.controller';

describe('LadiesNightController', () => {
  let controller: LadiesNightController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LadiesNightController],
    }).compile();

    controller = module.get<LadiesNightController>(LadiesNightController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
