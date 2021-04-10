export interface IDateProvider {
  isBefore(date: Date | number, dateToCompare: Date | number): boolean;
  isSameDay(dateLeft: Date | number, dateRight: Date | number): boolean;
  differenceInDays(dateLeft: Date | number, dateRight: Date | number): number;
}
