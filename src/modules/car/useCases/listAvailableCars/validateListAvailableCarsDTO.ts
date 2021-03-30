import { AppError } from '@shared/errors/AppError';
import { extractValidationErrors } from '@shared/utils/formatValidationError';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { ListAvailableCarsDTO } from '../../dtos/ListAvailableCarsDTO';

export const validateListAvailableCarsDTO = async (
  data: any,
): Promise<ListAvailableCarsDTO> => {
  const listAvailableCarsDTO = plainToClass(ListAvailableCarsDTO, data);

  const paramErrors = await validate(listAvailableCarsDTO);

  if (paramErrors.length) {
    const errorMessages = extractValidationErrors(paramErrors);

    throw new AppError(errorMessages);
  }

  return listAvailableCarsDTO;
};
