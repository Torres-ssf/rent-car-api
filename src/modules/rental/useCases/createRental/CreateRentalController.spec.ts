import 'reflect-metadata';

import jwt from 'jsonwebtoken';
import request from 'supertest';
import { app } from '@shared/app';
import { Connection } from 'typeorm';
import { getTypeormConnection } from '@shared/database';
import auth from '@config/auth';
import { v4 } from 'uuid';
import { getUserAuthToken } from '@modules/user/seeds';
import { createDummyCar } from '@modules/car/seeds';
import { createDummyCategory } from '@modules/category/seeds';
import { IDateProvider } from '@shared/container/providers/DateProvider/models/IDateProvider';
import { container } from 'tsyringe';
import { parseISO } from 'date-fns';
import { Status } from '@modules/rental/enums/Status';
import { randomizeANumber } from '@shared/utils/randomizeANumber';

describe('Create Rental', () => {
  let connection: Connection;

  let dateProvider: IDateProvider;

  let userToken: string;

  let categoryId: string;

  let carId: string;

  beforeAll(async () => {
    connection = await getTypeormConnection();

    await connection.runMigrations();

    dateProvider = container.resolve<IDateProvider>('DateProvider');

    userToken = await getUserAuthToken(connection);

    categoryId = await createDummyCategory(connection);

    carId = await createDummyCar(connection, categoryId);
  });

  afterAll(async () => {
    await connection.dropDatabase();

    await connection.close();
  });

  it('should ensure user is authenticated', async () => {
    await request(app)
      .post(`/rental/${v4()}`)
      .send({})
      .expect(401)
      .expect(res =>
        expect(res.body).toHaveProperty('message', 'JWT token is missing'),
      );

    await request(app)
      .post(`/rental/${v4()}`)
      .set('Authorization', `Bearer 23452345823490-5890-23485-9023485`)
      .send({})
      .expect(401)
      .expect(res =>
        expect(res.body).toHaveProperty('message', 'Invalid JWT token'),
      );
  });

  it('should validate all endpoint body params', async () => {
    await request(app)
      .post(`/rental/${v4()}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        start_date: '2021-4',
        expected_return_date: 45,
      })
      .expect(res => {
        expect(res.status).toBe(400);
        expect(res.body.message).toContain('start_date must be a date string');
        expect(res.body.message).toContain(
          'expected_return_date must be a date string',
        );
      });

    await request(app)
      .post(`/rental/${v4()}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        start_date: '2021-5-7',
        expected_return_date: '',
      })
      .expect(res => {
        expect(res.status).toBe(400);
        expect(res.body.message).toContain('start_date must be a date string');
        expect(res.body.message).toContain(
          'expected_return_date must be a date string',
        );
      });
  });

  it('should ensure user is found for the given id', async () => {
    const { secret, expiresIn } = auth.jwt;

    const token = jwt.sign({}, secret, {
      subject: v4(),
      expiresIn,
    });

    await request(app)
      .post(`/rental/${v4()}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        start_date: '2021-04-04',
        expected_return_date: '2021-04-07',
      })
      .expect(res => {
        expect(res.status).toBe(401);
        expect(res.body.message).toContain(
          'No user was found for the given id',
        );
      });
  });

  it('should ensure car is found for the given id', async () => {
    await request(app)
      .post(`/rental/${v4()}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        start_date: '2021-04-04',
        expected_return_date: '2021-04-07',
      })
      .expect(res => {
        expect(res.status).toBe(400);
        expect(res.body.message).toContain('No car found for the given id');
      });
  });

  it('should ensure car is available for rental', async () => {
    const newCarId = v4();

    await connection.query(
      `INSERT INTO car( id, model, brand, max_speed, horse_power,
        zero_to_one_hundred, license_plate, daily_value, fine_amount,
        available, category_id )
        VALUES('${newCarId}', 'A8', 'Audi', 350, 335, 6.8, '${v4()}', 150, 50, false, '${categoryId}') `,
    );

    global.Date.now = jest.fn(() => new Date(2021, 1, 10).getTime());

    await request(app)
      .post(`/rental/${newCarId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        start_date: '2021-02-10',
        expected_return_date: '2021-02-16',
      })
      .expect(res => {
        expect(res.status).toBe(400);
        expect(res.body.message).toContain('Car is not available');
      });
  });

  it('should ensure start_date cannot be in the past', async () => {
    global.Date.now = jest.fn(() => new Date(2021, 1, 10).getTime());

    await request(app)
      .post(`/rental/${carId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        start_date: '2021-02-09',
        expected_return_date: '2021-02-16',
      })
      .expect(res => {
        expect(res.status).toBe(400);
        expect(res.body.message).toContain('Start date cannot be a past date');
      });
  });

  it('should ensure start_date cannot be in the future', async () => {
    global.Date.now = jest.fn(() => new Date(2021, 1, 10).getTime());

    await request(app)
      .post(`/rental/${carId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        start_date: '2021-02-11',
        expected_return_date: '2021-02-16',
      })
      .expect(res => {
        expect(res.status).toBe(400);
        expect(res.body.message).toContain(
          'Start date cannot be a future date',
        );
      });
  });

  it('should ensure expected_return_date cannot be in the past', async () => {
    global.Date.now = jest.fn(() => new Date(2021, 1, 10).getTime());

    await request(app)
      .post(`/rental/${carId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        start_date: '2021-02-10',
        expected_return_date: '2021-02-09',
      })
      .expect(res => {
        expect(res.status).toBe(400);
        expect(res.body.message).toContain('Return date cannot be a past date');
      });
  });

  it('should ensure start_date and expected_return_date are not in same day', async () => {
    global.Date.now = jest.fn(() => new Date(2021, 1, 10).getTime());

    await request(app)
      .post(`/rental/${carId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        start_date: '2021-02-10',
        expected_return_date: '2021-02-10',
      })
      .expect(res => {
        expect(res.status).toBe(400);
        expect(res.body.message).toContain(
          'Return date cannot be at the same day as the start date',
        );
      });
  });

  it('should ensure rental can be created with given params', async () => {
    const startDate = '2021-02-10';

    const endDate = '2021-02-14';

    const newCarId = v4();

    const carDailyValue = 250;

    const carDailyFine = 50;

    await connection.query(
      `INSERT INTO
        car( id, model, brand, max_speed, horse_power,
          zero_to_one_hundred, license_plate, daily_value, fine_amount,
          available, category_id )
        VALUES('${newCarId}', 'A8', 'Audi', 350, 335, 6.8, '${v4()}', ${carDailyValue},
          ${carDailyFine}, true, '${categoryId}') `,
    );

    global.Date.now = jest.fn(() => new Date(2021, 1, 10).getTime());

    await request(app)
      .post(`/rental/${newCarId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({
        start_date: startDate,
        expected_return_date: endDate,
      })
      .expect(res => {
        expect(res.status).toBe(201);
        expect(
          dateProvider.isSameDay(
            parseISO(res.body.start_date),
            parseISO(startDate),
          ),
        ).toBeTruthy();
        expect(
          dateProvider.isSameDay(
            parseISO(res.body.expected_return_date),
            parseISO(endDate),
          ),
        ).toBeTruthy();
        expect(res.body.car_id).toBe(newCarId);
        expect(res.body.car_daily_value).toBe(carDailyValue);
        expect(res.body.car_daily_fine).toBe(carDailyFine);
        expect(res.body.status).toBe(Status.Open);
        expect(res.body.returned_date).toBe(null);
        expect(res.body.total).toBe(null);
      });

    await connection.query(`DELETE FROM rental`);
  });
});
