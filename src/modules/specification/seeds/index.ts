import { Connection } from 'typeorm';
import { v4 } from 'uuid';
import { TypeormSpecification } from '../entities/TypeormSpecification';
import { Specification } from '../models/Specification';

export const createSpecifications = async (
  connection: Connection,
  specificationsParams: Pick<Specification, 'name' | 'description'>[],
): Promise<string[]> => {
  const ids: string[] = [];
  const specificationsQuery = specificationsParams.map(params => {
    const id = v4();

    ids.push(id);

    return connection.query(
      `INSERT INTO specification(id, name, description)
       values('${id}', '${params.name}', '${params.description}')`,
    );
  });

  await Promise.all(specificationsQuery);

  return ids;
};

export const createDummySpecifications = async (
  connection: Connection,
  numOfSpecifications: number,
): Promise<string[]> => {
  const ids: string[] = [];

  await connection
    .createQueryBuilder()
    .insert()
    .into(TypeormSpecification)
    .values(
      Array.from({ length: numOfSpecifications }, (_, index) => {
        const id = v4();

        ids.push(id);

        return {
          id,
          name: `Dummy ${index}`,
          description: `This is a dummy spec ${index}`,
        };
      }),
    )
    .execute();

  return ids;
};
