import 'reflect-metadata';
import jwt from 'jsonwebtoken';
import request from 'supertest';
import { app } from '@shared/app';
import { Connection } from 'typeorm';
import { getTypeormConnection } from '@shared/database';
import auth from '@config/auth';
import { v4 } from 'uuid';
import fs from 'fs';

describe('Register User Endpoint', () => {
  let connection: Connection;

  beforeAll(async () => {
    connection = await getTypeormConnection();

    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();

    await connection.close();
  });

  it('should not allow unauthenticated user', async () => {
    await request(app)
      .patch('/user/avatar')
      .expect(401)
      .expect(res =>
        expect(res.body).toHaveProperty('message', 'JWT token is missing'),
      );

    await request(app)
      .patch('/user/avatar')
      .set('Authorization', `Bearer 23452345823490-5890-23485-9023485`)
      .expect(401)
      .expect(res =>
        expect(res.body).toHaveProperty('message', 'Invalid JWT token'),
      );
  });

  it('should ensure a user exists for the given user id', async () => {
    const { secret, expiresIn } = auth.jwt;

    const token = jwt.sign({}, secret, {
      subject: v4(),
      expiresIn,
    });

    const avatarImage = fs.createReadStream('src/shared/asset/avatar.png');

    await request(app)
      .patch('/user/avatar')
      .set('Authorization', `Bearer ${token}`)
      .attach('avatar', avatarImage)
      .expect(401)
      .expect(res =>
        expect(res.body).toHaveProperty(
          'message',
          'No user was found for the given id',
        ),
      );
  });
});
