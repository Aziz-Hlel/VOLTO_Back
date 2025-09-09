import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import {
  getPresignedUrlRequestBody,
  IgetPresignedUrlRequestBody,
} from '../vars/testMedia';

type TgetPresignedUrl = {
  app: INestApplication;
  body?: IgetPresignedUrlRequestBody;
  accessToken: string;
};

const getPresignedUrl = async ({
  app,
  body = getPresignedUrlRequestBody,
  accessToken,
}: TgetPresignedUrl) => {
  const response = await request(app.getHttpServer())
    .post('/media/presigned-url')
    .set('Authorization', `Bearer ${accessToken}`)
    .send(body)
    .expect(200);

  expect(response.body).toHaveProperty('url');
  expect(response.body).toHaveProperty('s3Key');

  return response.body as { url: string; s3Key: string };
};

export default getPresignedUrl;
