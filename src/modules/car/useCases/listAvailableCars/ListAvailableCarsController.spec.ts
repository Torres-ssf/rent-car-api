import 'reflect-metadata';

import request from 'supertest';
import { app } from '@shared/app';
import { Connection } from 'typeorm';
import { getUserAuthToken } from '@modules/user/seeds';
import { createDummyCategory } from '@modules/category/seeds';
import { v4 } from 'uuid';
import { createManyDummyCars } from '@modules/car/seeds';
import { randomizeANumber } from '@shared/utils/randomizeANumber';
import { getTypeormConnection } from '@shared/database';

describe('List Available Cars Endpoint', () => {
  let connection: Connection;

  let userToken: string;

  let dummyCategoryId: string;

  beforeAll(async () => {
    connection = await getTypeormConnection();

    await connection.runMigrations();

    userToken = await getUserAuthToken(connection);

    dummyCategoryId = await createDummyCategory(connection);
  });

  afterAll(async () => {
    await connection.dropDatabase();

    await connection.close();
  });

  it('should not allow unauthenticated user', async () => {
    await request(app)
      .get('/car/available')
      .send({})
      .expect(401)
      .expect(res =>
        expect(res.body).toHaveProperty('message', 'JWT token is missing'),
      );

    await request(app)
      .get('/car/available')
      .set('Authorization', `Bearer 23452345823490-5890-23485-9023485`)
      .send({})
      .expect(401)
      .expect(res =>
        expect(res.body).toHaveProperty('message', 'Invalid JWT token'),
      );
  });

  it('should validate params when they are provided', async () => {
    await request(app)
      .get('/car/available')
      .set('Authorization', `Bearer ${userToken}`)
      .query({ model: '', brand: '', category_id: 123412341 })
      .expect(400)
      .expect(res => {
        expect(res.body.message).toContain('model should not be empty');
        expect(res.body.message).toContain('brand should not be empty');
        expect(res.body.message).toContain('category_id must be a UUID');
      });
  });

  it('should check if category_id belongs to a category when its provided', async () => {
    await request(app)
      .get('/car/available')
      .set('Authorization', `Bearer ${userToken}`)
      .query({ category_id: v4() })
      .expect(400)
      .expect(res => {
        expect(res.body.message).toContain('Category does not exists');
      });
  });

  it('should find car by category if its available', async () => {
    const randomNumOfCars = randomizeANumber(2, 5);

    const randomNumOfUnavailableCars = randomizeANumber(1, randomNumOfCars);

    const availableCars = randomNumOfCars - randomNumOfUnavailableCars;

    await createManyDummyCars(
      connection,
      { category_id: dummyCategoryId },
      randomNumOfCars,
      randomNumOfUnavailableCars,
    );

    await request(app)
      .get('/car/available')
      .set('Authorization', `Bearer ${userToken}`)
      .query({ category_id: dummyCategoryId })
      .expect(200)
      .expect(res => {
        expect(res.body).toHaveLength(availableCars);
        for (let i = 0; i < availableCars; i += 1) {
          expect(res.body[i]).toHaveProperty('category_id', dummyCategoryId);
        }
      });

    await connection.query(
      `DELETE FROM car WHERE category_id = '${dummyCategoryId}'`,
    );
  });

  it('should find car by model if its available', async () => {
    const model = 'A8';

    const randomNumOfCars = randomizeANumber(2, 5);

    const randomNumOfUnavailableCars = randomizeANumber(1, randomNumOfCars);

    const availableCars = randomNumOfCars - randomNumOfUnavailableCars;

    await createManyDummyCars(
      connection,
      { model, category_id: dummyCategoryId },
      randomNumOfCars,
      randomNumOfUnavailableCars,
    );

    await request(app)
      .get('/car/available')
      .set('Authorization', `Bearer ${userToken}`)
      .query({ model })
      .expect(200)
      .expect(res => {
        expect(res.body).toHaveLength(availableCars);
        for (let i = 0; i < availableCars; i += 1) {
          expect(res.body[i]).toHaveProperty('model', model);
        }
      });

    await connection.query(`DELETE FROM car WHERE model = '${model}'`);
  });

  it('should find car by brand if its available', async () => {
    const brand = 'Ferrari';

    const randomNumOfCars = randomizeANumber(2, 5);

    const randomNumOfUnavailableCars = randomizeANumber(1, randomNumOfCars);

    const availableCars = randomNumOfCars - randomNumOfUnavailableCars;

    await createManyDummyCars(
      connection,
      { brand, category_id: dummyCategoryId },
      randomNumOfCars,
      randomNumOfUnavailableCars,
    );

    await request(app)
      .get('/car/available')
      .set('Authorization', `Bearer ${userToken}`)
      .query({ brand })
      .expect(200)
      .expect(res => {
        expect(res.body).toHaveLength(availableCars);
        for (let i = 0; i < availableCars; i += 1) {
          expect(res.body[i]).toHaveProperty('brand', brand);
        }
      });

    await connection.query(`DELETE FROM car WHERE brand = '${brand}'`);
  });

  it('should find car by all 3 params if its available', async () => {
    const brand = 'Ferrari';

    const model = 'A8';

    const randomNumOfCars = randomizeANumber(2, 5);

    const randomNumOfUnavailableCars = randomizeANumber(1, randomNumOfCars);

    const availableCars = randomNumOfCars - randomNumOfUnavailableCars;

    await createManyDummyCars(
      connection,
      { model, brand, category_id: dummyCategoryId },
      randomNumOfCars,
      randomNumOfUnavailableCars,
    );

    await request(app)
      .get('/car/available')
      .set('Authorization', `Bearer ${userToken}`)
      .query({ brand })
      .expect(200)
      .expect(res => {
        expect(res.body).toHaveLength(availableCars);
        for (let i = 0; i < availableCars; i += 1) {
          expect(res.body[i]).toHaveProperty('brand', brand);
        }
      });

    await connection.query(`DELETE FROM car WHERE brand = '${brand}'`);
  });
});
