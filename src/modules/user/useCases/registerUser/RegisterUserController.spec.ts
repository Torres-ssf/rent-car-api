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

  it('should validate all endpoint body params', async () => {
    await request(app)
      .post('/user')
      .send({
        name: 12,
        email: 'notEmail',
        password: undefined,
        driver_license: '',
      })
      .expect(res => {
        expect(res.body.message).toContain('name must be a string');
        expect(res.body.message).toContain('email must be an email');
        expect(res.body.message).toContain(
          'password must be longer than or equal to 8 characters',
        );
        expect(res.body.message).toContain(
          'driver_license should not be empty',
        );
      });

    await request(app)
      .post('/user')
      .send({
        name: '',
        email: 3123,
        password: '1233123312',
        driver_license: 3456456,
      })
      .expect(res => {
        expect(res.body.message).toContain('name should not be empty');
        expect(res.body.message).toContain('email must be an email');
        expect(res.body.message).toContain(
          'Password should have at least one number, one lower letter, one upper letter and no empty spaces',
        );
        expect(res.body.message).toContain('driver_license must be a string');
      });
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

  it('should verify if there is another user created with the given driver_license', async () => {
    const userParams = usersSeed[1];

    await createDummyUser(connection, userParams);

    await request(app)
      .post('/user')
      .send({
        name: 'Fake User',
        email: 'fake1@email.com',
        password: userParams.password,
        driver_license: userParams.driver_license,
      })
      .expect(res => {
        expect(res.body.message).toBe(
          'Driver license already being used by another user',
        );
      });
  });

  it('should not return the user password and admin in the return data', async () => {
    const userParams = usersSeed[2];

    await request(app)
      .post('/user')
      .send({
        name: userParams.name,
        email: userParams.email,
        password: userParams.password,
        driver_license: userParams.driver_license,
      })
      .expect(res => {
        expect(res.status).toBe(201);
        expect(res.body).not.toHaveProperty('password');
        expect(res.body).not.toHaveProperty('admin');
      });
  });
});
