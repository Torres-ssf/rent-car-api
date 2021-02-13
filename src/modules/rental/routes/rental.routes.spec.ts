import 'reflect-metadata';

import request from 'supertest';
import { app } from '@shared/app';

describe('Rent Car Endpoint', () => {
  describe('car_id and client_id params must be UUID', () => {
    it('should return related error message when params are not UUID', async () => {
      const res = await request(app).post('/rental').send({
        car_id: 'notUuid',
        client_id: 'notUuid',
        start_date: '2021-02-14',
        end_date: '2021-02-14',
      });

      expect(res.body.message).toContain('car_id must be a UUID');
      expect(res.body.message).toContain('client_id must be a UUID');
    });

    it('should not return related error message when params are UUID', async () => {
      const res = await request(app).post('/rental').send({
        car_id: '409b03e3-e6ee-4a84-96ea-1bb7cc329091',
        client_id: '2645a491-2b5d-480f-887d-7ac647903b99',
        start_date: '2021-02-14',
        end_date: '2021-02-14',
      });

      expect(res.body.message).not.toContain('car_id must be a UUID');
      expect(res.body.message).not.toContain('client_id must be a UUID');
    });
  });
});
