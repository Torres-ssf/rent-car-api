import 'reflect-metadata';

import { randomizeANumber } from '@shared/utils/randomizeANumber';
import { FakeSpecificationRepository } from '@modules/specification/repositories/fakes/FakeSpecificationRepository';
import { ListSpecificationsUseCase } from './ListSpecificationsUseCase';
import specificationsSeeds from '../../seeds/specifications.json';

describe('ListSpecificationsUseCase', () => {
  let specificationRepository: FakeSpecificationRepository;

  let listSpecificationsUseCase: ListSpecificationsUseCase;

  beforeAll(() => {
    specificationRepository = new FakeSpecificationRepository();

    listSpecificationsUseCase = new ListSpecificationsUseCase(
      specificationRepository,
    );
  });

  it('should list all created specifications', async () => {
    const randomNumber = randomizeANumber(1, specificationsSeeds.length);

    const promises = [];

    for (let i = 0; i < randomNumber; i += 1) {
      promises.push(
        specificationRepository.create({
          name: specificationsSeeds[i].name,
          description: specificationsSeeds[i].description,
        }),
      );
    }

    await Promise.all(promises);

    const specificationsList = await listSpecificationsUseCase.execute();

    expect(specificationsList.length).toBe(randomNumber);
  });
});
