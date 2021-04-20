import 'reflect-metadata';

import request from 'supertest';
import { app } from '@shared/app';
import { Connection } from 'typeorm';
import { getTypeormConnection } from '@shared/database';

describe('Create Session Endpoint', () => {
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
      .post('/session/signin')
      .send({
        email: 12341234,
        password: 'asASfdsf',
      })
      .expect(res => {
        expect(res.status).toBe(400);
        expect(res.body.message).toContain('email must be an email');
        expect(res.body.message).toContain(
          'Password should have at least one number, one lower letter, one upper letter and no empty spaces',
        );
      });

    await request(app)
      .post('/session/signin')
      .send({
        email: 'notEmail',
        password: 'asas1212',
      })
      .expect(res => {
        expect(res.status).toBe(400);
        expect(res.body.message).toContain('email must be an email');
        expect(res.body.message).toContain(
          'Password should have at least one number, one lower letter, one upper letter and no empty spaces',
        );
      });

    await request(app)
      .post('/session/signin')
      .send({
        email: '',
        password: 'ASAS1212',
      })
      .expect(res => {
        expect(res.status).toBe(400);
        expect(res.body.message).toContain('email must be an email');
        expect(res.body.message).toContain(
          'Password should have at least one number, one lower letter, one upper letter and no empty spaces',
        );
      });

    await request(app)
      .post('/session/signin')
      .send({
        email: 'patrick@',
        password: 'asAS1212',
      })
      .expect(res => {
        expect(res.status).toBe(400);
        expect(res.body.message).toContain('email must be an email');
        expect(res.body.message).toContain(
          'Password should have at least one number, one lower letter, one upper letter and no empty spaces',
        );
      });
  });
});
