import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import {
  createEventRequestBody,
  IcreateEventRequestBody,
} from '../vars/testEvent';

type TcreateEvent = {
  app: INestApplication;
  body?: IcreateEventRequestBody;
  accessToken: string;
};

const createEvent = async ({
  app,
  body = createEventRequestBody,
}: TcreateEvent) => {
  const response = await request(app.getHttpServer())
    .post('/events')
    .send(body)
    .expect(200);

  expect(response.status).toBe(201);

  return response.body.id as string;
};

export default createEvent;
