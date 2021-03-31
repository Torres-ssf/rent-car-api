import 'reflect-metadata';

import request from 'supertest';

import { app } from '@shared/app';

describe('User Register Endpoint', () => {
  const userParams = {
    name: 'Paul Airon',
    email: 'paul@email.com',
    password: 'fdsSs932',
    driver_license: '1345234123',
  };

  it('should check if name have at least 3 chars length and max 80 chars length', async () => {
    const res1 = await request(app).post('/user').send({
      name: 'yo',
      email: userParams.email,
      password: userParams.password,
      driver_license: userParams.driver_license,
    });

    const res2 = await request(app).post('/user').send({
      name:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ip',
      email: userParams.email,
      password: userParams.password,
      driver_license: userParams.driver_license,
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

  it('should check if email has email syntax', async () => {
    const res1 = await request(app).post('/user').send({
      name: userParams.name,
      email: 'paul',
      password: userParams.password,
      driver_license: userParams.driver_license,
    });

    const res2 = await request(app).post('/user').send({
      name: userParams.name,
      email: 'paul@email',
      password: userParams.password,
      driver_license: userParams.driver_license,
    });

    expect(res1.status).toBe(400);
    expect(res1.body.message).toContain('email must be an email');

    expect(res2.status).toBe(400);
    expect(res2.body.message).toContain('email must be an email');
  });

  it('should check if email is not case sensitive', async () => {
    const res1 = await request(app).post('/user').send({
      name: userParams.name,
      email: 'PAUL@email.com',
      password: userParams.password,
      driver_license: '13241234145',
    });

    const res2 = await request(app).post('/user').send({
      name: userParams.name,
      email: 'PAUL@email.com',
      password: userParams.password,
      driver_license: userParams.driver_license,
    });

    const res3 = await request(app).post('/user').send({
      name: userParams.name,
      email: 'PAul@email.com',
      password: userParams.password,
      driver_license: userParams.driver_license,
    });

    expect(res1.status).toBe(201);
    expect(res1.body.email).toBe('paul@email.com');

    expect(res2.status).toBe(400);
    expect(res2.body.message).toContain('Email already taken');

    expect(res3.status).toBe(400);
    expect(res3.body.message).toContain('Email already taken');
  });

  it('should check if password has at least 8 chars long and 20 chars max', async () => {
    const res1 = await request(app).post('/user').send({
      name: userParams.name,
      email: userParams.email,
      password: '1234567',
      driver_license: userParams.driver_license,
    });

    const res2 = await request(app).post('/user').send({
      name: userParams.name,
      email: userParams.email,
      password: '012345678901234567890',
      driver_license: userParams.driver_license,
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

  it('should check if password has at least 1 number, 1 lower and 1 upper case letters, and no empty spaces', async () => {
    const res1 = await request(app).post('/user').send({
      name: userParams.name,
      email: userParams.email,
      password: 'asASfdsf',
      driver_license: userParams.driver_license,
    });

    const res2 = await request(app).post('/user').send({
      name: userParams.name,
      email: userParams.email,
      password: 'asas1212',
      driver_license: userParams.driver_license,
    });

    const res3 = await request(app).post('/user').send({
      name: userParams.name,
      email: userParams.email,
      password: 'ASAS1212',
      driver_license: userParams.driver_license,
    });

    const res4 = await request(app).post('/user').send({
      name: userParams.name,
      email: userParams.email,
      password: 'asAS1212 ',
      driver_license: userParams.driver_license,
    });

    const res5 = await request(app).post('/user').send({
      name: userParams.name,
      email: 'david@email.com ',
      password: userParams.password,
      driver_license: '3654453563456',
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

    expect(res5.status).toBe(201);
  });

  it('should check if fields have no empty spaces at the start or the end', async () => {
    const res = await request(app).post('/user').send({
      name: '     No Empty Space     ',
      email: '    nospace@email.com     ',
      password: userParams.password,
      driver_license: '634563568678',
    });

    expect(res.status).toBe(201);
    expect(res.body.name).toBe('No Empty Space');
    expect(res.body.email).toBe('nospace@email.com');
  });

  it('should check if user is being properly created', async () => {
    const res = await request(app).post('/user').send({
      name: 'Sergio Torres',
      email: 'sergio@email.com',
      password: 'rtyFSf123',
      driver_license: '07896856354',
    });

    expect(res.status).toBe(201);
    expect(res.body.name).toBe('Sergio Torres');
    expect(res.body.email).toBe('sergio@email.com');
  });

  it('should check if returned user object has no password property', async () => {
    const res = await request(app).post('/user').send({
      name: 'Brian',
      email: 'brian@email.com',
      password: 'rtyFSf123',
      driver_license: userParams.driver_license,
    });

    expect(res.body.password).toBeUndefined();
  });
});
