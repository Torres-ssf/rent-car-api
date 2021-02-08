import 'reflect-metadata';

import request from 'supertest';

import { app } from '@shared/app';

describe('User Register Endpoint', () => {
  const userParams = {
    name: 'Paul Airon',
    email: 'paul@email.com',
    password: '.fdsSs932',
  };

  it('ensures name have at least 3 chars length and max 80 chars length', async () => {
    const res1 = await request(app).post('/user').send({
      name: 'yo',
      email: userParams.email,
      password: userParams.password,
    });

    const res2 = await request(app).post('/user').send({
      name:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ip',
      email: userParams.email,
      password: userParams.password,
    });

    expect(res1.status).toBe(400);
    expect(res1.body.message).toContain(
      'name must be longer than or equal to 3 characters',
    );

    expect(res2.status).toBe(400);
    expect(res2.body.message).toContain(
      'name must be shorter than or equal to 80 characters',
    );
  });

  it('ensure that email is a real email', async () => {
    const res1 = await request(app).post('/user').send({
      name: userParams.name,
      email: 'paul',
      password: userParams.password,
    });

    const res2 = await request(app).post('/user').send({
      name: userParams.name,
      email: 'paul@email',
      password: userParams.password,
    });

    expect(res1.status).toBe(400);
    expect(res1.body.message).toContain('email must be an email');

    expect(res2.status).toBe(400);
    expect(res2.body.message).toContain('email must be an email');
  });
});
