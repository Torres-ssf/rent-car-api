import { ValidationError } from 'class-validator';

export const extractValidationErrors = (
  errors: ValidationError[],
): string[] => {
  const formattedErrors = errors.reduce((accumulator, nextError) => {
    const { constraints } = nextError;

    if (!constraints) {
      return accumulator;
    }

    const messages = Object.values(constraints);

    return [...accumulator, ...messages];
  }, [] as string[]);

  return formattedErrors;
};
