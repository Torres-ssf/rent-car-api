import 'reflect-metadata';

import jwt from 'jsonwebtoken';
import fs from 'fs';
import request from 'supertest';
import { app } from '@shared/app';
import { Connection } from 'typeorm';
import { getTypeormConnection } from '@shared/database';
import auth from '@config/auth';
import { v4 } from 'uuid';
import { getUserAuthToken } from '@modules/user/seeds';

describe('Create Rental', () => {
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

  it('should ensure user is authenticated', async () => {
    await request(app)
      .post(`/rental/${v4()}`)
      .send({})
      .expect(401)
      .expect(res =>
        expect(res.body).toHaveProperty('message', 'JWT token is missing'),
      );

    await request(app)
      .post(`/rental/${v4()}`)
      .set('Authorization', `Bearer 23452345823490-5890-23485-9023485`)
      .send({})
      .expect(401)
      .expect(res =>
        expect(res.body).toHaveProperty('message', 'Invalid JWT token'),
      );
  });

  it('should validate all endpoint body params', async () => {
    await request(app)
      .post(`/rental/${v4()}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        start_date: '2021-4',
        expected_return_date: 45,
      })
      .expect(res => {
        expect(400);
        expect(res.body.message).toContain('start_date must be a date string');
        expect(res.body.message).toContain(
          'expected_return_date must be a date string',
        );
      });

    await request(app)
      .post(`/rental/${v4()}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        start_date: '2021-5-7',
        expected_return_date: '',
      })
      .expect(res => {
        expect(400);
        expect(res.body.message).toContain('start_date must be a date string');
        expect(res.body.message).toContain(
          'expected_return_date must be a date string',
        );
      });
  });
});
