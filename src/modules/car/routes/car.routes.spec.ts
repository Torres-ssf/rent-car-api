import 'reflect-metadata';

import request from 'supertest';
import { app } from '../../../shared/app';

describe('Car Register Endpoint', () => {
  it('should ensure that car name, brand, and dailyValue are present', async () => {
    const res = await request(app).post('/car').send({});

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toContain('name must be a string');
    expect(res.body.message).toContain('brand must be a string');
    expect(res.body.message).toContain('daily_value must be a positive number');
  });

  it('should ensure that car name and brand are not empty string', async () => {
    const res = await request(app).post('/car').send({
      name: 'as',
      brand: 'sa',
      dailyValue: 900,
    });

    console.log(res);

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('message');
    expect(res.body.message).toContain(
      'name must be longer than or equal to 3 characters',
    );
    expect(res.body.message).toContain(
      'brand must be longer than or equal to 3 characters',
    );
  });
});
