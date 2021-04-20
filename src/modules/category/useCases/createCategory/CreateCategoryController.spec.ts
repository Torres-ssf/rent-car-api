import 'reflect-metadata';

import request from 'supertest';
import { app } from '@shared/app';
import { Connection } from 'typeorm';
import { getAdminAuthToken, getUserAuthToken } from '@modules/user/seeds/';
import { Category } from '@modules/category/models/Category';
import { getTypeormConnection } from '@shared/database';

describe('Create Category Endpoint', () => {
  let connection: Connection;

  let userToken: string;

  let adminToken: string;

  beforeAll(async () => {
    connection = await getTypeormConnection();

    await connection.runMigrations();

    adminToken = await getAdminAuthToken(connection);

    userToken = await getUserAuthToken(connection);
  });

  afterAll(async () => {
    await connection.dropDatabase();

    await connection.close();
  });

  it('should verify if user is an authenticated user', async () => {
    await request(app)
      .post('/category')
      .send({
        name: 'Sport',
        description: 'Sports cars category',
      })
      .expect(401)
      .expect(res =>
        expect(res.body).toHaveProperty('message', 'JWT token is missing'),
      );

    await request(app)
      .post('/category')
      .set('Authorization', `Bearer 23452345823490-5890-23485-9023485`)
      .send({
        name: 'Sport',
        description: 'Sports cars category',
      })
      .expect(401)
      .expect(res =>
        expect(res.body).toHaveProperty('message', 'Invalid JWT token'),
      );
  });

  it('should verify if user is an admin', async () => {
    await request(app)
      .post('/category')
      .send({
        name: 'Sport',
        description: 'Sports cars category',
      })
      .set('Authorization', `Bearer ${userToken}`)
      .expect(401)
      .expect(res =>
        expect(res.body).toHaveProperty(
          'message',
          'An admin is required for this operation',
        ),
      );
  });

  it('should verify if name and description params are strings and not empty', async () => {
    const res1 = await request(app)
      .post('/category')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 4,
        description: null,
      });

    const res2 = await request(app)
      .post('/category')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: '',
        description: '',
      });

    expect(res1.status).toBe(400);
    expect(res1.body.message).toContain('name must be a string');
    expect(res1.body.message).toContain('description must be a string');

    expect(res2.status).toBe(400);
    expect(res2.body.message).toContain('name should not be empty');
    expect(res2.body.message).toContain('description should not be empty');
  });

  it('should not allow to create a category with the name of another existent category', async () => {
    const categoryName = 'Unique Category';
    const categoryDescription = 'This is a unique category';

    await request(app)
      .post('/category')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: categoryName,
        description: categoryDescription,
      });

    await request(app)
      .post('/category')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: categoryName,
        description: categoryDescription,
      })
      .expect(400)
      .expect(res =>
        expect(res.body).toHaveProperty(
          'message',
          'Category with name Unique Category already exists',
        ),
      );

    const savedCategories = (await connection.query(
      `SELECT * FROM category where name = '${categoryName}'`,
    )) as Category[];

    expect(savedCategories).toHaveLength(1);
  });

  it('should create a new category and return it in the response', async () => {
    const nameParam = 'SUV';
    const descriptionParam = 'SUVs—often also referred to as crossovers—tend';

    const res = await request(app)
      .post('/category')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: nameParam,
        description: descriptionParam,
      });

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('name', nameParam);
    expect(res.body).toHaveProperty('description', descriptionParam);

    const savedCategory = (await connection.query(
      `SELECT * FROM category where name = 'SUV'`,
    )) as Category[];

    expect(savedCategory[0]).toHaveProperty('name', res.body.name);
    expect(savedCategory[0]).toHaveProperty(
      'description',
      res.body.description,
    );
  });
});
