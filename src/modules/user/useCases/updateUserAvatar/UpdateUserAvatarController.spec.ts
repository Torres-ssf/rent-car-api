import 'reflect-metadata';
import jwt from 'jsonwebtoken';
import request from 'supertest';
import { app } from '@shared/app';
import { Connection } from 'typeorm';
import { getTypeormConnection } from '@shared/database';
import auth from '@config/auth';
import { v4 } from 'uuid';
import fs from 'fs';
import { getUserAuthToken } from '@modules/user/seeds';

describe('Register User Endpoint', () => {
  let connection: Connection;

  let userToken: string;

  beforeAll(async () => {
    connection = await getTypeormConnection();

    await connection.runMigrations();

    userToken = await getUserAuthToken(connection);
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

    const avatarImage = fs.createReadStream(
      'src/shared/asset/avatar_image.png',
    );

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

  it('should ensure avatar file is saved for the given user', async () => {
    const avatarImage = fs.createReadStream(
      'src/shared/asset/avatar_image.png',
    );

    const res = await request(app)
      .patch('/user/avatar')
      .set('Authorization', `Bearer ${userToken}`)
      .attach('avatar', avatarImage);

    expect(res.body.avatar).toMatch(/avatar_image.png$/);

    await expect(
      fs.promises.stat(`tmp/avatar/${res.body.avatar}`),
    ).resolves.toBeTruthy();
  });
});
