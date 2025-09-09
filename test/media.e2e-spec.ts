import { INestApplication } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from 'src/app/app.module';
import { PrismaService } from 'src/prisma/prisma.service';
import login from './helper/login';
import getPresignedUrl from './helper/getPresignedUrl';
import uploadFile from './helper/uploadFile';
import createEvent from './helper/createEvent';
import { createEventRequestBody } from './vars/testEvent';
import getEvent from './helper/getEvent';
import createUser from './helper/createUser';

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
    await prisma.user.deleteMany();
  });

  afterAll(async () => {
    await prisma.$disconnect();
    await app.close();
  });

  beforeEach(async () => {
    // Clean database before each test
    await prisma.user.deleteMany();
  });

  describe('/auth/login (POST)', () => {
    it('Custom nik omk', async () => {
      await createUser({ prisma });

      const accessToken = await login(app);

      const preSignedUrlResponse = await getPresignedUrl({ app, accessToken });

      console.log('preSignedUrlResponse', preSignedUrlResponse.url);

      uploadFile({ presignedUrl: preSignedUrlResponse.url });

      const testEvent = {
        ...createEventRequestBody,
        thumbnailKey: preSignedUrlResponse.s3Key,
        videoKey: preSignedUrlResponse.s3Key,
      };

      console.log('testEvent', testEvent);

      const eventId = await createEvent({ app, body: testEvent, accessToken });

      const eventCreated = await getEvent({ app, id: eventId, accessToken });

      console.log(eventCreated);
    });
  });
});
