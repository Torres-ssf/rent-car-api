export const randomizeANumber = (
  minNumber: number,
  maxNumber: number,
): number => {
  return Math.floor(Math.random() * (maxNumber - 1) + minNumber);
};
