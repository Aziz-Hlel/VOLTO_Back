import { Test, TestingModule } from '@nestjs/testing';
import { SpinnigWheelService } from './spinnig-wheel.service';

describe('SpinnigWheelService', () => {
  let service: SpinnigWheelService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SpinnigWheelService],
    }).compile();

    service = module.get<SpinnigWheelService>(SpinnigWheelService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
