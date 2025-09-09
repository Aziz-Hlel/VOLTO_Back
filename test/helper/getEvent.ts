import { INestApplication } from '@nestjs/common';
import request from 'supertest';

type TgetEvent = {
  app: INestApplication;
  accessToken: string;
  id: string;
};

const getEvent = async ({ app, id, accessToken }: TgetEvent) => {
  const response = await request(app.getHttpServer())
    .set('Authorization', `Bearer ${accessToken}`)
    .get(`/events/${id}`)
    .expect(200);

  return response.body;
};

export default getEvent;
