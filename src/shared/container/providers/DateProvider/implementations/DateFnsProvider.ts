import { isBefore, startOfDay, differenceInDays, isSameDay } from 'date-fns';

import { IDateProvider } from '../models/IDateProvider';

export class DateFnsProvider implements IDateProvider {
  isBefore(date: number | Date, dateToCompare: number | Date): boolean {
    return isBefore(startOfDay(date), startOfDay(dateToCompare));
  }

  isSameDay(dateLeft: number | Date, dateRight: number | Date): boolean {
    return isSameDay(dateLeft, dateRight);
  }

  differenceInDays(dateLeft: number | Date, dateRight: number | Date): number {
    return differenceInDays(dateLeft, dateRight);
  }
}
