import 'reflect-metadata';

import { FakeCategoryRepository } from '@modules/category/repositories/fakes/FakeCategoryRepository';
import { CreateCategoryUseCase } from './CreateCategoryUseCase';

describe('CreateCategoryUseCase', () => {
  let categoryRepository: FakeCategoryRepository;

  let createCategoryUseCase: CreateCategoryUseCase;

  beforeAll(() => {
    categoryRepository = new FakeCategoryRepository();

    createCategoryUseCase = new CreateCategoryUseCase(categoryRepository);
  });

  it('should not allow a category to be created if already exists', async () => {
    const dummyCategory = await categoryRepository.create({
      name: 'Dummy',
      description: 'This is a dummy category',
    });

    await expect(
      createCategoryUseCase.execute({
        name: dummyCategory.name,
        description: 'This is another dummy category',
      }),
    ).rejects.toHaveProperty(
      'message',
      `Category with name ${dummyCategory.name} already exists`,
    );
  });
});
