import 'reflect-metadata';

import request from 'supertest';
import { app } from '@shared/app';
import { Connection, createConnection } from 'typeorm';
import { getAdminAuthToken, getUserAuthToken } from '@modules/user/seeds/';

describe('Create Specification Endpoint', () => {
  let connection: Connection;

  let userToken: string;

  let adminToken: string;

  beforeAll(async () => {
    connection = await createConnection();

    await connection.runMigrations();

    adminToken = await getAdminAuthToken(connection);

    userToken = await getUserAuthToken(connection);
  });

  afterAll(async () => {
    await connection.dropDatabase();

    await connection.close();
  });

  it('should verify if user is an authenticated user', async () => {
    await request(app)
      .post('/specification')
      .send({
        name: 'Dummy Spec',
        description: 'This is a dummy spec',
      })
      .expect(401)
      .expect(res =>
        expect(res.body).toHaveProperty('message', 'JWT token is missing'),
      );

    await request(app)
      .post('/specification')
      .set('Authorization', `Bearer 23452345823490-5890-23485-9023485`)
      .send({
        name: 'Dummy Spec',
        description: 'This is a dummy spec',
      })
      .expect(401)
      .expect(res =>
        expect(res.body).toHaveProperty('message', 'Invalid JWT token'),
      );
  });

  it('should verify if user is an admin', async () => {
    await request(app)
      .post('/specification')
      .send({
        name: 'Dummy Spec',
        description: 'This is a dummy spec',
      })
      .set('Authorization', `Bearer ${userToken}`)
      .expect(401)
      .expect(res =>
        expect(res.body).toHaveProperty(
          'message',
          'An admin is required for this operation',
        ),
      );
  });
});
