import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { IloginTestUser, loginTestUser } from './../vars/testUser';

const login = async (
  app: INestApplication,
  user: IloginTestUser = loginTestUser,
) => {
  const response = await request(app.getHttpServer())
    .post('/auth/login')
    .send(user)
    .expect(200);

  // Check response
  expect(response.body).toHaveProperty('accessToken');
  expect(response.body).toHaveProperty('refreshToken');

  return response.body.accessToken as string;
};

export default login;
