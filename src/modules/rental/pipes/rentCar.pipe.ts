import { AppError } from '@shared/errors/AppError';
import { extractValidationErrors } from '@shared/utils/formatValidationError';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { RentCarDTO } from '../useCases/RentCar/RentCarDTO';

export const rentCarPipe = async (data: RentCarDTO): Promise<RentCarDTO> => {
  const rentCarDTO = plainToClass(RentCarDTO, data);

  const paramErrors = await validate(rentCarDTO);

  if (paramErrors.length) {
    const errorMessages = extractValidationErrors(paramErrors);

    throw new AppError(errorMessages);
  }

  return rentCarDTO;
};
