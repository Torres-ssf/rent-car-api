import { AppError } from '@shared/errors/AppError';
import { extractValidationErrors } from '@shared/utils/formatValidationError';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { UpdateCarDTO } from '../useCases/UpdateCar/UpdateCarDTO';

export const updateShortsterPipe = async (
  data: UpdateCarDTO,
): Promise<UpdateCarDTO> => {
  const updateCarDTO = plainToClass(UpdateCarDTO, data);

  const paramErrors = await validate(updateCarDTO);

  if (paramErrors.length) {
    const errorMessages = extractValidationErrors(paramErrors);

    throw new AppError(errorMessages);
  }

  return updateCarDTO;
};
