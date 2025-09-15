import { Gender, PrismaClient, Role, Tier, User } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

type IUserSeeds = Omit<User, 'createdAt' | 'updatedAt'>;

const hashPassword = async (rawPassword: string): Promise<string> => {
  return await bcrypt.hash(rawPassword, 10);
};

const userSeeds = async (): Promise<IUserSeeds[]> => [
  {
    id: '4f8a2d1e-3b7f-4c2a-9e6a-7f2d8a1c3b4e',
    username: 'Super Admin',
    email: 'superadmin@example.com',
    password: await hashPassword('12345678'),
    role: Role.SUPER_ADMIN,
    gender: Gender.M,
    tier: Tier.PLATINUM,
    phoneNumber: null,
  },
  {
    id: '9c1b5f2d-7e4f-44c8-a1f2-3b6d7e8f9a0b',
    username: 'Admin',
    email: 'admin@example.com',
    password: await hashPassword('12345678'),
    role: Role.ADMIN,
    gender: Gender.M,
    tier: Tier.SILVER,
    phoneNumber: null,
  },
  {
    id: 'a7f1c3b2-8d4e-4f6a-b2c1-7d5e8f9a0b3c',
    username: 'Waiter',
    email: 'waiter@example.com',
    password: await hashPassword('12345678'),
    role: Role.WAITER,
    gender: Gender.M,
    tier: Tier.SILVER,
    phoneNumber: null,
  },
  {
    id: '2d7f1a3e-5b6c-4f2d-8e1a-9c3b4f5d6a7e',
    username: 'User',
    email: 'user@example.com',
    password: await hashPassword('12345678'),
    role: Role.USER,
    gender: Gender.M,
    tier: Tier.SILVER,
    phoneNumber: null,
  },
];

const seedUsers = async () => {
  const userSeedsObject = await userSeeds();

  for (const user of userSeedsObject) {
    await prisma.user.upsert({
      where: { email: user.email },
      update: user,
      create: user,
    });
  }
  // You can now use userSeeds for seeding logic here
};

export default seedUsers;
