import 'reflect-metadata';

import request from 'supertest';
import { app } from '@shared/app';
import { Connection, createConnection } from 'typeorm';
import { getUserAuthToken } from '@modules/user/seeds/';
import { Specification } from '@modules/specification/models/Specification';
import { createSpecifications } from '@modules/specification/seeds';

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

  it('should list all created specifications', async () => {
    const spec1 = {
      name: 'Electric Engine',
      description: 'An electric car.',
    };

    const spec2 = {
      name: 'Hybrid Engine',
      description: 'A hybrid electric vehicle (HEV).',
    };

    const specificationsParamsArr = [spec1, spec2];

    await createSpecifications(connection, specificationsParamsArr);

    await request(app)
      .get('/specification')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200)
      .expect(res => {
        expect(res.body).toHaveLength(2);
        expect(res.body).toMatchObject([spec1, spec2]);
      });

    const savedSpecifications = (await connection.query(
      `SELECT * FROM specification`,
    )) as Specification[];

    expect(savedSpecifications).toHaveLength(2);
    expect(savedSpecifications).toMatchObject([spec1, spec2]);
  });
});
