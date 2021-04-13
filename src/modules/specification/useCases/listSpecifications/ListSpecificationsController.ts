import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { ListSpecificationsUserCase } from './ListSpecificationsUseCase';

export class ListSpecificationsController {
  async handle(request: Request, response: Response): Promise<Response> {
    const listSpecificationsUseCase = container.resolve(
      ListSpecificationsUserCase,
    );

    const specifications = await listSpecificationsUseCase.execute();

    return response.json(specifications);
  }
}
