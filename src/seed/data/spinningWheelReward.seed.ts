import { PrismaClient, SpinningWheelReward } from '@prisma/client';

const prisma = new PrismaClient();

type ISpinningWheelRewardSeeds = Omit<
  SpinningWheelReward,
  'createdAt' | 'updatedAt'
>;

const rewards: ((wheelId: string) => ISpinningWheelRewardSeeds)[] = [
  (wheelId: string) => {
    return {
      id: '7d9dfb79-82d2-4a38-8230-46d09e3ac48e',
      name: 'win 100 dollars',
      wheelId: wheelId,
    };
  },
  (wheelId: string) => {
    return {
      id: '36ebf6a3-1d68-4b5d-b68a-1dd0dbe2db72',
      name: 'win 100 dollars',
      wheelId: wheelId,
    };
  },
];

const spinnigWheelRewardSeeds = async (wheelId: string) => {
  const wheelRewards = await prisma.spinningWheelReward.findMany();

  // for()
};
