import 'reflect-metadata';

import request from 'supertest';
import { app } from '@shared/app';
import { Connection } from 'typeorm';
import { getTypeormConnection } from '@shared/database';
import { createDummyUser } from '@modules/user/seeds';
import usersSeed from '../../seeds/users.json';

describe('Create Specification Endpoint', () => {
  let connection: Connection;

  beforeAll(async () => {
    connection = await getTypeormConnection();

    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();

    await connection.close();
  });

  it('should verify if there is another user created with the given email', async () => {
    const userParams = usersSeed[0];

    await createDummyUser(connection, userParams);

    await request(app)
      .post('/user')
      .send({
        name: userParams.name,
        email: userParams.email,
        password: userParams.password,
        driver_license: userParams.driver_license,
      })
      .expect(res => {
        expect(res.body.message).toBe('Email already taken');
      });
  });
});
