import { HOLIDAYS } from "./constants";

export type DayType = 'weekday' | 'saturday' | 'sunday';


export function getDayType(date: Date): DayType {
  // First check if it's a holiday
  const dateString = date.toISOString().split('T')[0];
  if (HOLIDAYS.includes(dateString)) {
    return 'sunday'; // Holidays are treated like Sundays
  }

  // Get the day of the week (0 = Sunday, 1 = Monday, ..., 6 = Saturday)
  const dayOfWeek = date.getDay();

  if (dayOfWeek === 0) {
    return 'sunday';
  }
  if (dayOfWeek === 6) {
    return 'saturday';
  }
  return 'weekday';
}

