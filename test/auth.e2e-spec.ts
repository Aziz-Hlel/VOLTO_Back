// auth.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import bcrypt from 'bcrypt';
import { AppModule } from '../src/app/app.module';
import { PrismaService } from 'src/prisma/prisma.service';

describe('Auth (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prisma = moduleFixture.get<PrismaService>(PrismaService);

    await app.init();
  });

  beforeEach(async () => {
    // Clean database before each test
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  describe('/auth/login (POST)', () => {
    it('should login with valid credentials', async () => {
      // Create test user
      const hashedPassword = await bcrypt.hash('password123', 10);
      const user = await prisma.user.create({
        data: {
          email: 'test@example.com',
          username: 'Test User',
          password: hashedPassword,
        },
      });

      // Test login
      const response = await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'password123',
        })
        .expect(200);

      // Check response
      expect(response.body).toHaveProperty('accessToken');
      //   expect(response.body.user.email).toBe('test@example.com');
      //   expect(response.body.user.password).toBeUndefined();
    });

    it('should return 401 for invalid password', async () => {
      // Create test user
      const hashedPassword = await bcrypt.hash('password123', 10);
      await prisma.user.create({
        data: {
          email: 'test@example.com',
          username: 'Test User',
          password: hashedPassword,
        },
      });

      // Test with wrong password
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'test@example.com',
          password: 'wrongpassword',
        })
        .expect(401);
    });

    it('should return 401 for non-existent user', async () => {
      await request(app.getHttpServer())
        .post('/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123',
        })
        .expect(401);
    });
  });
});

// Helper function (optional - put in separate file)
export const createTestUser = async (prisma: PrismaService, data = {}) => {
  const defaultData = {
    email: 'test@example.com',
    username: 'Test User',
    password: await bcrypt.hash('password123', 10),
  };

  return prisma.user.create({
    data: { ...defaultData, ...data },
  });
};
