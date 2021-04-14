import 'reflect-metadata';

import request from 'supertest';
import { app } from '@shared/app';
import { Connection, createConnection } from 'typeorm';
import { getAdminAuthToken, getUserAuthToken } from '@modules/user/seeds';
import { createDummyCategory } from '@modules/category/seeds';
import { Car } from '@modules/car/models/Car';
import { v4 } from 'uuid';
import carSeeds from '../../seeds/cars.json';

describe('List Available Cars Endpoint', () => {
  let connection: Connection;

  let userToken: string;

  let adminToken: string;

  let dummyCategoryId: string;

  beforeAll(async () => {
    connection = await createConnection();

    await connection.runMigrations();

    userToken = await getUserAuthToken(connection);

    dummyCategoryId = await createDummyCategory(connection);
  });

  afterAll(async () => {
    await connection.dropDatabase();

    await connection.close();
  });

  it('should not allow unauthenticated user', async () => {
    await request(app)
      .get('/car/available')
      .send({})
      .expect(401)
      .expect(res =>
        expect(res.body).toHaveProperty('message', 'JWT token is missing'),
      );

    await request(app)
      .get('/car/available')
      .set('Authorization', `Bearer 23452345823490-5890-23485-9023485`)
      .send({})
      .expect(401)
      .expect(res =>
        expect(res.body).toHaveProperty('message', 'Invalid JWT token'),
      );
  });

  it('should validate params when they are provided', async () => {
    await request(app)
      .get('/car/available')
      .set('Authorization', `Bearer ${userToken}`)
      .query({ model: '', brand: '', category_id: 123412341 })
      .expect(400)
      .expect(res => {
        expect(res.body.message).toContain('model should not be empty');
        expect(res.body.message).toContain('brand should not be empty');
        expect(res.body.message).toContain('category_id must be a UUID');
      });
  });
});
