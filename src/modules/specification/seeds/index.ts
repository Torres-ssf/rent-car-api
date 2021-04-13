import { Connection } from 'typeorm';
import { v4 } from 'uuid';
import { Specification } from '../models/Specification';

export const createSpecifications = async (
  connection: Connection,
  specificationsParams: Pick<Specification, 'name' | 'description'>[],
): Promise<void> => {
  const specificationsQuery = specificationsParams.map(params => {
    const id = v4();

    return connection.query(
      `INSERT INTO specification(id, name, description)
       values('${id}', '${params.name}', '${params.description}')`,
    );
  });

  await Promise.all(specificationsQuery);
};
