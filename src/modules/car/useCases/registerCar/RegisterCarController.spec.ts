import 'reflect-metadata';

import request from 'supertest';
import { app } from '@shared/app';
import { Connection } from 'typeorm';
import { getAdminAuthToken, getUserAuthToken } from '@modules/user/seeds';
import { createDummyCategory } from '@modules/category/seeds';
import { Car } from '@modules/car/models/Car';
import { v4 } from 'uuid';
import { getTypeormConnection } from '@shared/database';
import carSeeds from '../../seeds/cars.json';

describe('Register Car Endpoint', () => {
  let connection: Connection;

  let userToken: string;

  let adminToken: string;

  let dummyCategoryId: string;

  beforeAll(async () => {
    connection = await getTypeormConnection();

    await connection.runMigrations();

    adminToken = await getAdminAuthToken(connection);

    userToken = await getUserAuthToken(connection);

    dummyCategoryId = await createDummyCategory(connection);
  });

  afterAll(async () => {
    await connection.dropDatabase();

    await connection.close();
  });

  it('should not allow unauthenticated user', async () => {
    await request(app)
      .post('/car')
      .send({})
      .expect(401)
      .expect(res =>
        expect(res.body).toHaveProperty('message', 'JWT token is missing'),
      );

    await request(app)
      .post('/car')
      .set('Authorization', `Bearer 23452345823490-5890-23485-9023485`)
      .send({})
      .expect(401)
      .expect(res =>
        expect(res.body).toHaveProperty('message', 'Invalid JWT token'),
      );
  });

  it('should not allow users that are not admin', async () => {
    await request(app)
      .post('/car')
      .send({})
      .set('Authorization', `Bearer ${userToken}`)
      .expect(401)
      .expect(res =>
        expect(res.body).toHaveProperty(
          'message',
          'An admin is required for this operation',
        ),
      );
  });

  it('should not allow daily_value, fine_amount max_speed, horse_power, zero_to_one_hundred, be values different from positive numbers', async () => {
    await request(app)
      .post('/car')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        max_speed: -380,
        horse_power: -899,
        zero_to_one_hundred: -2.4,
        daily_value: -900,
        fine_amount: -200,
      })
      .expect(res => {
        expect(res.status).toBe(400);
        expect(res.body.message).toContain(
          'max_speed must be a positive number',
        );
        expect(res.body.message).toContain(
          'horse_power must be a positive number',
        );
        expect(res.body.message).toContain(
          'zero_to_one_hundred must be a positive number',
        );
        expect(res.body.message).toContain(
          'daily_value must be a positive number',
        );
        expect(res.body.message).toContain(
          'fine_amount must be a positive number',
        );
      });

    await request(app)
      .post('/car')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        max_speed: '380',
        horse_power: '899',
        zero_to_one_hundred: '2.4',
        daily_value: '900',
        fine_amount: '200',
      })
      .expect(res => {
        expect(res.status).toBe(400);
        expect(res.body.message).toContain(
          'max_speed must be a number conforming to the specified constraints',
        );
        expect(res.body.message).toContain(
          'horse_power must be a number conforming to the specified constraints',
        );
        expect(res.body.message).toContain(
          'zero_to_one_hundred must be a number conforming to the specified constraints',
        );
        expect(res.body.message).toContain(
          'daily_value must be a number conforming to the specified constraints',
        );
        expect(res.body.message).toContain(
          'fine_amount must be a number conforming to the specified constraints',
        );
      });
  });

  it('should remove empty spaces at the start and end from user inputted strings', async () => {
    await request(app)
      .post('/car')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        ...carSeeds[0],
        model: '          Enzo ',
        brand: '  Ferrari    ',
        license_plate: '      1231-SDA      ',
        category_id: dummyCategoryId,
      })
      .expect(res => {
        expect(res.status).toBe(201);
        expect(res.body.model === 'Enzo').toBeTruthy();
        expect(res.body.brand === 'Ferrari').toBeTruthy();
        expect(res.body.license_plate === '1231-SDA').toBeTruthy();
      });
  });

  it('should not allow category_id be any type different from uuid', async () => {
    await request(app)
      .post('/car')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        category_id: '7382457938027450892374',
      })
      .expect(res => {
        expect(res.status).toBe(400);
        expect(res.body.message).toContain('category_id must be a UUID');
      });
  });

  it('should not allow strange properties to the DTO being passed', async () => {
    await request(app)
      .post('/car')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        i_do_not_belong_here: 'let me pass',
      })
      .expect(res => {
        expect(res.status).toBe(400);
        expect(res.body.message).toContain(
          'property i_do_not_belong_here should not exist',
        );
      });
  });

  it('should not allow 2 or more cars to have the same license_plate number', async () => {
    const repeatedPlate = '1234-UDG';

    await request(app)
      .post('/car')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        ...carSeeds[0],
        license_plate: repeatedPlate,
        category_id: dummyCategoryId,
      })
      .expect(res => {
        expect(res.status).toBe(201);
      });

    await request(app)
      .post('/car')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        ...carSeeds[1],
        license_plate: repeatedPlate,
        category_id: dummyCategoryId,
      })
      .expect(res => {
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty(
          'message',
          'License plate already in use',
        );
      });
  });

  it('should not allow a car to be registered without a category', async () => {
    await request(app)
      .post('/car')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        ...carSeeds[2],
        category_id: v4(),
      })
      .expect(res => {
        expect(res.status).toBe(400);
        expect(res.body).toHaveProperty('message', 'Category does not exists');
      });
  });

  it('should create save a new car into the db and return it into the response', async () => {
    await request(app)
      .post('/car')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        ...carSeeds[2],
        category_id: dummyCategoryId,
      })
      .expect(res => {
        expect(res.status).toBe(201);
        expect(res.body).toMatchObject(carSeeds[2]);
      });

    const savedCar = (await connection.query(
      `SELECT * FROM car where license_plate = '${carSeeds[2].license_plate}'`,
    )) as Car[];

    expect(savedCar).toHaveLength(1);
    expect(savedCar[0]).toHaveProperty('model', carSeeds[2].model);
    expect(savedCar[0]).toHaveProperty('brand', carSeeds[2].brand);
    expect(savedCar[0]).toHaveProperty(
      'license_plate',
      carSeeds[2].license_plate,
    );
  });
});
