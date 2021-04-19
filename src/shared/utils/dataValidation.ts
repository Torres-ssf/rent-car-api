import { AppError } from '@shared/errors/AppError';
import { extractValidationErrors } from '@shared/utils/formatValidationError';
import { plainToClass, ClassConstructor } from 'class-transformer';
import { validate } from 'class-validator';

export const dataValidation = async <T extends Record<string, unknown>>(
  DTO: ClassConstructor<T>,
  dataDTO: T,
): Promise<T> => {
  const data = plainToClass(DTO, dataDTO);

  const paramErrors = await validate(data, {
    whitelist: true,
    forbidNonWhitelisted: true,
  });

  if (paramErrors.length) {
    const errorMessages = extractValidationErrors(paramErrors);

    throw new AppError(errorMessages);
  }

  return data;
};
