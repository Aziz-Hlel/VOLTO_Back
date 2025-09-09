import { INestApplication } from '@nestjs/common';
import request from 'supertest';

const me = async (app: INestApplication, accessToken: string) => {
  const response = await request(app.getHttpServer())
    .get('/auth/me')
    .set('Authorization', `Bearer ${accessToken}`)
    .expect(200);

  // Check response
  expect(response.body).toHaveProperty('email');

  return response.body;
};

export default me;
