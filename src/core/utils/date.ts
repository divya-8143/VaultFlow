import { RecurringFrequency } from '../types';

export class DateUtils {
  public static formatDateISO(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  public static addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  public static addMonths(date: Date, months: number): Date {
    const result = new Date(date);
    result.setMonth(result.getMonth() + months);
    return result;
  }

  public static addYears(date: Date, years: number): Date {
    const result = new Date(date);
    result.setFullYear(result.getFullYear() + years);
    return result;
  }

  public static getStartOfMonth(date: Date = new Date()): Date {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  }

  public static getEndOfMonth(date: Date = new Date()): Date {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0, 23, 59, 59, 999);
  }

  public static getNextRecurringDate(currentDate: Date, frequency: RecurringFrequency): Date {
    switch (frequency) {
      case RecurringFrequency.DAILY:
        return this.addDays(currentDate, 1);
      case RecurringFrequency.WEEKLY:
        return this.addDays(currentDate, 7);
      case RecurringFrequency.BIWEEKLY:
        return this.addDays(currentDate, 14);
      case RecurringFrequency.MONTHLY:
        return this.addMonths(currentDate, 1);
      case RecurringFrequency.QUARTERLY:
        return this.addMonths(currentDate, 3);
      case RecurringFrequency.ANNUALLY:
        return this.addYears(currentDate, 1);
      default:
        return this.addMonths(currentDate, 1);
    }
  }

  public static isDateBetween(targetDate: Date, startDate: Date, endDate: Date): boolean {
    const t = targetDate.getTime();
    return t >= startDate.getTime() && t <= endDate.getTime();
  }
}
