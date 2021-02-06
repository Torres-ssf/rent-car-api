import 'reflect-metadata';

import request from 'supertest';
import { app } from '@shared/app';

describe('Car Register Endpoint', () => {
  it('ensures that name and brand have at least 2 chars length and max 80 chars length', async () => {
    const resMinLength = await request(app).post('/car').send({
      name: 'as',
      brand: 'sa',
      daily_value: 900,
    });

    const resMaxLength = await request(app).post('/car').send({
      name:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially un',
      brand:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially un',
      daily_value: 900,
    });

    expect(resMinLength.status).toBe(400);
    expect(resMinLength.body.message).toContain(
      'name must be longer than or equal to 2 characters',
    );
    expect(resMinLength.body.message).toContain(
      'brand must be longer than or equal to 2 characters',
    );

    expect(resMaxLength.status).toBe(400);
    expect(resMaxLength.body.message).toContain(
      'name must be shorter than or equal to 80 characters',
    );
    expect(resMaxLength.body.message).toContain(
      'name must be shorter than or equal to 80 characters',
    );
  });

  it('ensures that daily_value is a positive value', async () => {
    const res = await request(app).post('/car').send({
      name: 'V8',
      brand: 'Ferrari',
      daily_value: -900,
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toContain('daily_value must be a positive number');
  });

  it('ensures that name and brand have no empty spaces at the start/end', async () => {
    const res = await request(app).post('/car').send({
      name: '          Enzo ',
      brand: '  Ferrari    ',
      daily_value: 900,
    });

    expect(res.status).toBe(200);
    expect(res.body.name === 'Enzo').toBeTruthy();
    expect(res.body.brand === 'Ferrari').toBeTruthy();
  });

  it('ensures endpoint returns the recently registered car', async () => {
    const res = await request(app).post('/car').send({
      name: 'Enzo',
      brand: 'Ferrari',
      daily_value: 900,
    });

    expect(res.status).toBe(200);
    expect(res.body.name === 'Enzo').toBeTruthy();
    expect(res.body.brand === 'Ferrari').toBeTruthy();
    expect(res.body.daily_value === 900).toBeTruthy();
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('created_at');
    expect(res.body).toHaveProperty('updated_at');
  });
});
