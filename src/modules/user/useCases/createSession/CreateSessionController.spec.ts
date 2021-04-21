import 'reflect-metadata';
import { verify } from 'jsonwebtoken';
import request from 'supertest';
import { app } from '@shared/app';
import { Connection } from 'typeorm';
import { getTypeormConnection } from '@shared/database';
import { createDummyUser } from '@modules/user/seeds';
import auth from '@config/auth';
import usersSeeds from '../../seeds/users.json';

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
        password: 'asAS 1212',
      })
      .expect(res => {
        expect(res.status).toBe(400);
        expect(res.body.message).toContain('email must be an email');
        expect(res.body.message).toContain(
          'Password should have at least one number, one lower letter, one upper letter and no empty spaces',
        );
      });
  });

  it('should check if a user exists for the given email', async () => {
    await request(app)
      .post('/session/signin')
      .send({
        email: 'nonexistentuser@email.com',
        password: 'asASfdsf99',
      })
      .expect(res => {
        expect(res.status).toBe(403);
        expect(res.body.message).toContain('wrong email/password combination');
      });
  });

  it('should ensure if given password is right password', async () => {
    const userParams = usersSeeds[0];

    await createDummyUser(connection, userParams);

    await request(app)
      .post('/session/signin')
      .send({
        email: userParams.email,
        password: 'wrongPassword10',
      })
      .expect(res => {
        expect(res.status).toBe(403);
        expect(res.body.message).toContain('wrong email/password combination');
      });
  });

  it('should ensure jwt token is returned in the response', async () => {
    const userParams = usersSeeds[1];

    const { secret } = auth.jwt;

    await createDummyUser(connection, userParams);

    await request(app)
      .post('/session/signin')
      .send({
        email: userParams.email,
        password: userParams.password,
      })
      .expect(res => {
        expect(res.status).toBe(201);
        expect(res.body).toHaveProperty('token');

        const { sub } = verify(res.body.token, secret) as any;

        expect(sub).toBe(res.body.user.id);
      });
  });
});
