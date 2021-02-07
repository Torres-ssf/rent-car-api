import { AppError } from '@shared/errors/AppError';
import { extractValidationErrors } from '@shared/utils/formatValidationError';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { RegisterUserDTO } from '../useCases/RegisterUser/RegisterUserDTO';

export const registerUserPipe = async (
  data: RegisterUserDTO,
): Promise<RegisterUserDTO> => {
  const registerUserDTO = plainToClass(RegisterUserDTO, data);

  const paramErrors = await validate(registerUserDTO);

  if (paramErrors.length) {
    const errorMessages = extractValidationErrors(paramErrors);

    throw new AppError(errorMessages);
  }

  return registerUserDTO;
};
