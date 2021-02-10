import 'reflect-metadata';

import request from 'supertest';

import { app } from '@shared/app';

describe('Create Session Endpoint', () => {
  const userParams = {
    email: 'paul@email.com',
    password: 'fdsSs932',
  };

  it('should check if email has email syntax', async () => {
    const res1 = await request(app).post('/session/signin').send({
      email: 'paul',
      password: userParams.password,
    });

    const res2 = await request(app).post('/session/signin').send({
      email: 'paul@email',
      password: userParams.password,
    });

    expect(res1.status).toBe(400);
    expect(res1.body.message).toContain('email must be an email');

    expect(res2.status).toBe(400);
    expect(res2.body.message).toContain('email must be an email');
  });

  it('should check if password has at least 8 chars long and 20 chars max', async () => {
    const res1 = await request(app).post('/session/signin').send({
      email: userParams.email,
      password: '1234567',
    });

    const res2 = await request(app).post('/session/signin').send({
      email: userParams.email,
      password: '012345678901234567890',
    });

    expect(res1.status).toBe(400);
    expect(res1.body.message).toContain(
      'password must be longer than or equal to 8 characters',
    );

    expect(res2.status).toBe(400);
    expect(res2.body.message).toContain(
      'password must be shorter than or equal to 20 characters',
    );
  });

  it('should verify if password has at least 1 number, 1 lower and 1 upper case letters', async () => {
    const res1 = await request(app).post('/session/signin').send({
      email: userParams.email,
      password: 'asASfdsf',
    });

    const res2 = await request(app).post('/session/signin').send({
      email: userParams.email,
      password: 'asas1212',
    });

    const res3 = await request(app).post('/session/signin').send({
      email: userParams.email,
      password: 'ASAS1212',
    });

    const res4 = await request(app).post('/session/signin').send({
      email: userParams.email,
      password: 'asAS1212 ',
    });

    expect(res1.status).toBe(400);
    expect(res1.body.message).toContain(
      'Password should have at least one number, one lower letter, one upper letter and no empty spaces',
    );

    expect(res2.status).toBe(400);
    expect(res2.body.message).toContain(
      'Password should have at least one number, one lower letter, one upper letter and no empty spaces',
    );

    expect(res3.status).toBe(400);
    expect(res3.body.message).toContain(
      'Password should have at least one number, one lower letter, one upper letter and no empty spaces',
    );

    expect(res4.status).toBe(400);
    expect(res4.body.message).toContain(
      'Password should have at least one number, one lower letter, one upper letter and no empty spaces',
    );
  });
});
