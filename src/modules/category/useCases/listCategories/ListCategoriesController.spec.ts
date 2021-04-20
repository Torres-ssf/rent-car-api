import 'reflect-metadata';

import request from 'supertest';
import { app } from '@shared/app';
import { Connection } from 'typeorm';
import { User } from '@modules/user/models/User';
import { getUserAuthToken } from '@modules/user/seeds/';
import { createCategories } from '@modules/category/seeds';
import { getTypeormConnection } from '@shared/database';

describe('List Categories Endpoint', () => {
  let connection: Connection;

  let userToken: string;

  beforeAll(async () => {
    connection = await getTypeormConnection();

    await connection.runMigrations();

    userToken = await getUserAuthToken(connection);
  });

  afterAll(async () => {
    await connection.dropDatabase();

    await connection.close();
  });

  it('should verify if user is an authenticated user', async () => {
    await request(app)
      .get('/category')
      .expect(401)
      .expect(res =>
        expect(res.body).toHaveProperty('message', 'JWT token is missing'),
      );

    await request(app)
      .get('/category')
      .set('Authorization', `Bearer 23452345823490-5890-23485-9023485`)
      .expect(401)
      .expect(res =>
        expect(res.body).toHaveProperty('message', 'Invalid JWT token'),
      );
  });

  it('should list all created categories', async () => {
    const cat1 = {
      name: 'Sedan',
      description: 'A sedan has four doors and a traditional trunk.',
    };

    const cat2 = {
      name: 'Coupe',
      description:
        'A coupe has historically been considered a two-door car with a trunk and a solid roof.',
    };

    const categoriesParamsArr = [cat1, cat2];

    await createCategories(connection, categoriesParamsArr);

    await request(app)
      .get('/category')
      .set('Authorization', `Bearer ${userToken}`)
      .expect(200)
      .expect(res => {
        expect(res.body).toHaveLength(2);
        expect(res.body).toMatchObject([cat1, cat2]);
      });

    const savedCategories = (await connection.query(
      `SELECT * FROM category`,
    )) as User[];

    expect(savedCategories).toHaveLength(2);
    expect(savedCategories).toMatchObject([cat1, cat2]);
  });
});
