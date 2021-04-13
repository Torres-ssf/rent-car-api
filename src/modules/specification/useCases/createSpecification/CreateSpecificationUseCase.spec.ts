import 'reflect-metadata';

import { FakeSpecificationRepository } from '@modules/specification/repositories/fakes/FakeSpecificationRepository';
import { CreateSpecificationUseCase } from './CreateSpecificationUseCase';

describe('ListSpecificationsUseCase', () => {
  let specificationRepository: FakeSpecificationRepository;

  let createSpecificationUseCase: CreateSpecificationUseCase;

  beforeEach(() => {
    specificationRepository = new FakeSpecificationRepository();

    createSpecificationUseCase = new CreateSpecificationUseCase(
      specificationRepository,
    );
  });

  it('should not allow a specification to be created if another one exists with the same name', async () => {
    const specification = await specificationRepository.create({
      name: 'Electric Engine',
      description: 'Dummy Desc.',
    });

    await expect(
      createSpecificationUseCase.execute({
        name: specification.name,
        description: 'Another Dummy desc',
      }),
    ).rejects.toHaveProperty('message', 'Specification already exists');
  });
});
