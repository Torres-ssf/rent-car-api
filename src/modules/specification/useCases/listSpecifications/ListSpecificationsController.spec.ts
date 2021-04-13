import 'reflect-metadata';

import request from 'supertest';
import { app } from '@shared/app';
import { Connection, createConnection } from 'typeorm';
import { getUserAuthToken } from '@modules/user/seeds/';

describe('List Specifications Endpoint', () => {
  let connection: Connection;

  let userToken: string;

  beforeAll(async () => {
    connection = await createConnection();

    await connection.runMigrations();

    userToken = await getUserAuthToken(connection);
  });

  afterAll(async () => {
    await connection.dropDatabase();

    await connection.close();
  });

  it('should verify if user is an authenticated user', async () => {
    await request(app)
      .get('/specification')
      .expect(401)
      .expect(res =>
        expect(res.body).toHaveProperty('message', 'JWT token is missing'),
      );

    await request(app)
      .get('/specification')
      .set('Authorization', `Bearer 23452345823490-5890-23485-9023485`)
      .expect(401)
      .expect(res =>
        expect(res.body).toHaveProperty('message', 'Invalid JWT token'),
      );
  });
});
