import 'reflect-metadata';

import request from 'supertest';
import { app } from '@shared/app';
import { Connection, createConnection } from 'typeorm';
import { getAdminAuthToken, getUserAuthToken } from '@modules/user/seeds';
import { createDummyCategory } from '@modules/category/seeds';
import { v4 } from 'uuid';

describe('Add Specification to Car Endpoint', () => {
  let connection: Connection;

  let userToken: string;

  let adminToken: string;

  let dummyCategoryId: string;

  beforeAll(async () => {
    connection = await createConnection();

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
      .post('/car/12341234/add-specification')
      .send({})
      .expect(401)
      .expect(res =>
        expect(res.body).toHaveProperty('message', 'JWT token is missing'),
      );

    await request(app)
      .post('/car/12341234/add-specification')
      .set('Authorization', `Bearer 23452345823490-5890-23485-9023485`)
      .send({})
      .expect(401)
      .expect(res =>
        expect(res.body).toHaveProperty('message', 'Invalid JWT token'),
      );
  });

  it('should not allow users that are not admin', async () => {
    await request(app)
      .post('/car/12341234/add-specification')
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

  it('should ensure car id is an UUID and specifications_ids is an array with uniques UUID', async () => {
    await request(app)
      .post('/car/12341234/add-specification')
      .send({
        specification_ids: 'ids',
      })
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(400)
      .expect(res => {
        expect(res.body.message).toContain('car_id must be a UUID');
        expect(res.body.message).toContain(
          'specifications_ids must be an array',
        );
      });

    await request(app)
      .post('/car/12341234/add-specification')
      .send({
        specification_ids: [],
      })
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(400)
      .expect(res => {
        expect(res.body.message).toContain(
          'specifications_ids must contain at least 1 elements',
        );
      });

    await request(app)
      .post('/car/12341234/add-specification')
      .send({
        specification_ids: ['id1', 'id2', v4()],
      })
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(400)
      .expect(res => {
        expect(res.body.message).toContain(
          'each value in specifications_ids must be a UUID',
        );
      });
  });
});
