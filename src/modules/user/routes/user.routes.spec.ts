import 'reflect-metadata';

import request from 'supertest';

import { app } from '@shared/app';

describe('User Register Endpoint', () => {
  const userParams = {
    name: 'Paul Airon',
    email: 'paul@email.com',
    password: 'fdsSs932',
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

  it('ensures email has email syntax', async () => {
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

  it('ensures email is not case sensitive', async () => {
    const res1 = await request(app).post('/user').send({
      name: userParams.name,
      email: 'PAUL@email.com',
      password: userParams.password,
    });

    const res2 = await request(app).post('/user').send({
      name: userParams.name,
      email: 'PAUL@email.com',
      password: userParams.password,
    });

    const res3 = await request(app).post('/user').send({
      name: userParams.name,
      email: 'PAul@email.com',
      password: userParams.password,
    });

    expect(res1.status).toBe(200);
    expect(res1.body.email).toBe('paul@email.com');

    expect(res2.status).toBe(400);
    expect(res2.body.message).toContain('Email already taken');

    expect(res3.status).toBe(400);
    expect(res3.body.message).toContain('Email already taken');
  });

  it('ensures password has at least 8 chars long and 20 chars max', async () => {
    const res1 = await request(app).post('/user').send({
      name: userParams.name,
      email: userParams.email,
      password: '1234567',
    });

    const res2 = await request(app).post('/user').send({
      name: userParams.name,
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

  it('ensures password has at least 1 number, 1 lower and 1 upper case letters', async () => {
    const res1 = await request(app).post('/user').send({
      name: userParams.name,
      email: userParams.email,
      password: 'asASfdsf',
    });

    const res2 = await request(app).post('/user').send({
      name: userParams.name,
      email: userParams.email,
      password: 'asas1212',
    });

    const res3 = await request(app).post('/user').send({
      name: userParams.name,
      email: userParams.email,
      password: 'ASAS1212',
    });

    const res4 = await request(app).post('/user').send({
      name: userParams.name,
      email: 'david@email.com ',
      password: userParams.password,
    });

    expect(res1.status).toBe(400);
    expect(res1.body.message).toContain(
      'Password should have at least one number, one lower letter, and one upper letter',
    );

    expect(res2.status).toBe(400);
    expect(res2.body.message).toContain(
      'Password should have at least one number, one lower letter, and one upper letter',
    );

    expect(res3.status).toBe(400);
    expect(res3.body.message).toContain(
      'Password should have at least one number, one lower letter, and one upper letter',
    );

    expect(res4.status).toBe(200);
  });

  it('ensures fields have no empty spaces at the start or the end', async () => {
    const res = await request(app).post('/user').send({
      name: '     No Empty Space     ',
      email: '    nospace@email.com     ',
      password: userParams.password,
    });

    expect(res.status).toBe(200);
    expect(res.body.name).toBe('No Empty Space');
    expect(res.body.email).toBe('nospace@email.com');
  });

  it('ensures user is being properly created', async () => {
    const res = await request(app).post('/user').send({
      name: 'Sergio Torres',
      email: 'sergio@email.com',
      password: 'rtyFSf123',
    });

    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Sergio Torres');
    expect(res.body.email).toBe('sergio@email.com');
  });
});
