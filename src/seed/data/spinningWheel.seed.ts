import { PrismaClient, SpinningWheel } from '@prisma/client';

const prisma = new PrismaClient();

type ISpinningWheel = Omit<SpinningWheel, 'createdAt' | 'updatedAt'>;

const spinnigWheelInstance: ISpinningWheel = {
  id: '6a96e2cb-7e14-41f8-a2c1-42ffac7ed6f8',
  name: 'Test Spinnig Wheel',
  startDate: new Date(),
  endDate: new Date(),
  isActive: true,
};

const seedSpinnigWheel = async () => {};
