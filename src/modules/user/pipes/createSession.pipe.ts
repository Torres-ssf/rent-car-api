import { AppError } from '@shared/errors/AppError';
import { extractValidationErrors } from '@shared/utils/formatValidationError';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { CreateSessionDTO } from '../useCases/createSession/CreateSessionDTO';

export const createSessionPipe = async (
  data: CreateSessionDTO,
): Promise<CreateSessionDTO> => {
  const createSessionDTO = plainToClass(CreateSessionDTO, data);

  const paramErrors = await validate(createSessionDTO);

  if (paramErrors.length) {
    const errorMessages = extractValidationErrors(paramErrors);

    throw new AppError(errorMessages);
  }

  return createSessionDTO;
};
