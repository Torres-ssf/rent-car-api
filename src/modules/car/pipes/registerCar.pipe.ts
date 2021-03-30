import { AppError } from '@shared/errors/AppError';
import { extractValidationErrors } from '@shared/utils/formatValidationError';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { RegisterCarDTO } from '../useCases/registerCar/RegisterCarDTO';

export const registerCarPipe = async (
  data: RegisterCarDTO,
): Promise<RegisterCarDTO> => {
  const registerCarDTO = plainToClass(RegisterCarDTO, data);

  const paramErrors = await validate(registerCarDTO);

  if (paramErrors.length) {
    const errorMessages = extractValidationErrors(paramErrors);

    throw new AppError(errorMessages);
  }

  return registerCarDTO;
};
