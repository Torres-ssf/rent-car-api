import 'reflect-metadata';

import request from 'supertest';
import { app } from '@shared/app';

describe('Car Register Endpoint', () => {
  const carParams = {
    model: 'F8',
    brand: 'Ferrari',
    max_speed: 340,
    horse_power: 720,
    license_plate: '1231-SDA',
    zero_to_one_hundred: 2.9,
    daily_value: 900,
    fine_amount: 200,
  };

  it('ensures that model and brand have at least 2 chars length and max 80 chars length', async () => {
    const resMinLength = await request(app).post('/car').send({
      model: 'a',
      brand: 's',
      daily_value: 900,
    });

    const resMaxLength = await request(app).post('/car').send({
      model:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially un',
      brand:
        'Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industrys standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially un',
      daily_value: 900,
    });

    expect(resMinLength.status).toBe(400);
    expect(resMinLength.body.message).toContain(
      'model must be longer than or equal to 2 characters',
    );
    expect(resMinLength.body.message).toContain(
      'brand must be longer than or equal to 2 characters',
    );

    expect(resMaxLength.status).toBe(400);
    expect(resMaxLength.body.message).toContain(
      'model must be shorter than or equal to 80 characters',
    );
    expect(resMaxLength.body.message).toContain(
      'brand must be shorter than or equal to 80 characters',
    );
  });

  it('ensures that max_speed, horse_power, zero_to_one_hundred, daily_value are positive values', async () => {
    const res = await request(app).post('/car').send({
      max_speed: -380,
      horse_power: -899,
      zero_to_one_hundred: -2.4,
      daily_value: -900,
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toContain('max_speed must be a positive number');
    expect(res.body.message).toContain('horse_power must be a positive number');
    expect(res.body.message).toContain(
      'zero_to_one_hundred must be a positive number',
    );
    expect(res.body.message).toContain('daily_value must be a positive number');
  });

  it('ensures all Car string properties have no empty spaces at the start/end', async () => {
    const resCat = await request(app).post('/category').send({
      name: 'SUV',
      description: 'Big car for the family',
    });

    const res = await request(app)
      .post('/car')
      .send({
        ...carParams,
        model: '          Enzo ',
        brand: '  Ferrari    ',
        license_plate: '      1231-SDA      ',
        category_id: resCat.body.id,
      });

    expect(res.status).toBe(200);
    expect(res.body.model === 'Enzo').toBeTruthy();
    expect(res.body.brand === 'Ferrari').toBeTruthy();
    expect(res.body.license_plate === '1231-SDA').toBeTruthy();
  });
});
