import 'reflect-metadata';

import { FakeCategoryRepository } from '@modules/category/repositories/fakes/FakeCategoryRepository';
import { randomizeANumber } from '@shared/utils/randomizeANumber';
import { ListCategoriesUseCase } from './ListCategoriesUseCase';
import categoriesSeed from '../../seeds/categories.json';

describe('ListCategoriesUseCase', () => {
  let categoryRepository: FakeCategoryRepository;

  let listCategoriesUseCase: ListCategoriesUseCase;

  beforeAll(() => {
    categoryRepository = new FakeCategoryRepository();

    listCategoriesUseCase = new ListCategoriesUseCase(categoryRepository);
  });

  it('should list all created categories', async () => {
    const randomNumber = randomizeANumber(1, categoriesSeed.length);

    const promises = [];

    for (let i = 0; i < randomNumber; i += 1) {
      promises.push(
        categoryRepository.create({
          name: categoriesSeed[i].name,
          description: categoriesSeed[i].description,
        }),
      );
    }

    await Promise.all(promises);

    const categoriesList = await listCategoriesUseCase.execute();

    expect(categoriesList.length).toBe(randomNumber);
  });
});
