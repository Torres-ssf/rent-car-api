import 'reflect-metadata';

import request from 'supertest';

import { app } from '@shared/app';

describe('Create Session Endpoint', () => {
  const userParams = {
    email: 'paul@email.com',
    password: 'fdsSs932',
  };

  it('should check of email has email syntax', async () => {
    const res1 = await request(app).post('/user').send({
      email: 'paul',
      password: userParams.password,
    });

    const res2 = await request(app).post('/user').send({
      email: 'paul@email',
      password: userParams.password,
    });

    expect(res1.status).toBe(400);
    expect(res1.body.message).toContain('email must be an email');

    expect(res2.status).toBe(400);
    expect(res2.body.message).toContain('email must be an email');
  });
});
