import { IDateProvider } from '../models/IDateProvider';

export class FakeDateProvider implements IDateProvider {
  isBefore(date: number | Date, dateToCompare: number | Date): boolean {
    return new Date(date) < new Date(dateToCompare);
  }

  isSameDay(dateLeft: number | Date, dateRight: number | Date): boolean {
    const first = new Date(dateLeft);

    const second = new Date(dateRight);

    return (
      first.getFullYear() === second.getFullYear() &&
      first.getMonth() === second.getMonth() &&
      first.getDate() === second.getDate()
    );
  }

  differenceInDays(dateLeft: number | Date, dateRight: number | Date): number {
    const left = new Date(dateLeft).getTime();

    const right = new Date(dateRight).getTime();

    const difference = Math.abs(left - right);

    return Math.ceil(difference / (1000 * 3600 * 24));
  }
}
