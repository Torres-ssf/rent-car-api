import 'reflect-metadata';
import request from 'supertest';
import { app } from '@shared/app';
import { Connection } from 'typeorm';
import { getAdminAuthToken, getUserAuthToken } from '@modules/user/seeds';
import { createDummyCategory } from '@modules/category/seeds';
import { v4 } from 'uuid';
import { createDummyCar } from '@modules/car/seeds';
import { createDummySpecifications } from '@modules/specification/seeds';

import { TypeormSpecification } from '@modules/specification/entities/TypeormSpecification';
import { getTypeormConnection } from '@shared/database';

describe('Add Specification to Car Endpoint', () => {
  let connection: Connection;

  let userToken: string;

  let adminToken: string;

  let dummyCategoryId: string;

  let dummyCarId: string;

  beforeAll(async () => {
    connection = await getTypeormConnection();

    await connection.runMigrations();

    adminToken = await getAdminAuthToken(connection);

    userToken = await getUserAuthToken(connection);

    dummyCategoryId = await createDummyCategory(connection);

    dummyCarId = await createDummyCar(connection, dummyCategoryId);
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
        specifications_ids: 'ids',
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
        specifications_ids: [],
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
        specifications_ids: ['id1', 'id2', v4()],
      })
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(400)
      .expect(res => {
        expect(res.body.message).toContain(
          'each value in specifications_ids must be a UUID',
        );
      });
  });

  it('should verify if car exists for the given car id', async () => {
    await request(app)
      .post(`/car/${v4()}/add-specification`)
      .send({
        specifications_ids: [v4()],
      })
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(400)
      .expect(res => {
        expect(res.body.message).toContain('No car found for the given car id');
      });
  });

  it('should ensure specifications can be find for all given specification ids', async () => {
    await request(app)
      .post(`/car/${dummyCarId}/add-specification`)
      .send({
        specifications_ids: [v4(), v4(), v4()],
      })
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(400)
      .expect(res => {
        expect(res.body.message).toContain(
          'No specifications were found for the given ids',
        );
      });

    const ids = await createDummySpecifications(connection, 2);

    await request(app)
      .post(`/car/${dummyCarId}/add-specification`)
      .send({
        specifications_ids: [v4(), ...ids],
      })
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(400)
      .expect(res => {
        expect(res.body.message).toContain(
          'One or more specifications were not found for the given ids',
        );
      });
  });

  it('should verify if car already have the given specifications', async () => {
    const specIds = await createDummySpecifications(connection, 2);

    const specification = (await connection
      .createQueryBuilder(TypeormSpecification, 'specs')
      .where('specs.id = :id', { id: specIds[0] })
      .getOne()) as TypeormSpecification;

    const carWithSpecId = await createDummyCar(connection, dummyCategoryId, [
      specification,
    ]);

    await request(app)
      .post(`/car/${carWithSpecId}/add-specification`)
      .send({
        specifications_ids: [...specIds],
      })
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(400)
      .expect(res => {
        expect(res.body.message).toContain(
          `Car already have specification ${specification.name}`,
        );
      });
  });

  it('should add specifications to car', async () => {
    const specIds = await createDummySpecifications(connection, 2);

    const specifications = await connection
      .createQueryBuilder(TypeormSpecification, 'specs')
      .where('specs.id IN (:...specIds)', { specIds })
      .getMany();

    const car1Id = await createDummyCar(connection, dummyCategoryId);

    const car2Id = await createDummyCar(connection, dummyCategoryId, [
      specifications[0],
    ]);

    await request(app)
      .post(`/car/${car1Id}/add-specification`)
      .send({
        specifications_ids: specIds,
      })
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(201)
      .expect(res => {
        expect(res.body.id).toBe(car1Id);
        expect(res.body.specifications[0].id).toBe(specifications[0].id);
        expect(res.body.specifications[1].id).toBe(specifications[1].id);
      });

    await request(app)
      .post(`/car/${car2Id}/add-specification`)
      .send({
        specifications_ids: [specIds[1]],
      })
      .set('Authorization', `Bearer ${adminToken}`)
      .expect(201)
      .expect(res => {
        expect(res.body.id).toBe(car2Id);
        expect(res.body.specifications[0].id).toBe(specifications[0].id);
        expect(res.body.specifications[1].id).toBe(specifications[1].id);
      });
  });
});
