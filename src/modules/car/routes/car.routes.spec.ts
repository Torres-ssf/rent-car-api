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
});
