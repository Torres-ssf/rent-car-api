import { Connection } from 'typeorm';
import { v4 } from 'uuid';
import { Category } from '../models/Category';

export const createCategories = async (
  connection: Connection,
  categoriesParams: Pick<Category, 'name' | 'description'>[],
): Promise<void> => {
  const categoriesQuery = categoriesParams.map(params => {
    const id = v4();

    return connection.query(
      `INSERT INTO category(id, name, description)
       values('${id}', '${params.name}', '${params.description}')`,
    );
  });

  await Promise.all(categoriesQuery);
};

export const createDummyCategory = async (
  connection: Connection,
): Promise<string> => {
  const id = v4();

  await connection.query(
    `INSERT INTO category(id, name, description)
     values('${id}', 'Dummy', 'This is a dummy category')`,
  );

  return id;
};
