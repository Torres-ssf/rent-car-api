import 'reflect-metadata';

import request from 'supertest';
import { app } from '@shared/app';
import { Engine, Transmission } from '../models/enums';

describe('Car Register Endpoint', () => {
  const carParams = {
    model: 'F8',
    brand: 'Ferrari',
    max_speed: 340,
    horse_power: 720,
    zero_to_one_hundred: 2.9,
    engine: Engine.Gas,
    transmission: Transmission.Automatic,
    passengers: 2,
    daily_value: 900,
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
    const res = await request(app)
      .post('/car')
      .send({
        ...carParams,
        model: '          Enzo ',
        brand: '  Ferrari    ',
        engine: 'gas   ',
        transmission: '   automatic    ',
      });

    expect(res.status).toBe(200);
    expect(res.body.model === 'Enzo').toBeTruthy();
    expect(res.body.brand === 'Ferrari').toBeTruthy();
    expect(res.body.engine === 'GAS').toBeTruthy();
    expect(res.body.transmission === 'AUTOMATIC').toBeTruthy();
  });

  it('ensures transmission value is one of the Transmission enum', async () => {
    const res = await request(app).post('/car').send({
      transmission: 'car t',
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toContain(
      'engine must be one of Manual,Automatic',
    );
  });

  it('ensures engine value is one of the Engine enum', async () => {
    const res = await request(app).post('/car').send({
      transmission: 'uranium',
    });

    expect(res.status).toBe(400);
    expect(res.body.message).toContain(
      'engine must be one of Gas,Hybrid,Eletric',
    );
  });

  // it('ensures endpoint returns the recently registered car', async () => {
  //   const res = await request(app).post('/car').send({
  //     name: 'Enzo',
  //     brand: 'Ferrari',
  //     daily_value: 900,
  //   });

  //   expect(res.status).toBe(200);
  //   expect(res.body.name === 'Enzo').toBeTruthy();
  //   expect(res.body.brand === 'Ferrari').toBeTruthy();
  //   expect(res.body.daily_value === 900).toBeTruthy();
  //   expect(res.body).toHaveProperty('id');
  //   expect(res.body).toHaveProperty('created_at');
  //   expect(res.body).toHaveProperty('updated_at');
  // });
});
