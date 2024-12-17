import { winterStart, winterEnd, summerStart, summerEnd, transition1Start, transition1End, transition2Start, transition2End } from "./constants";
import { getDayType, DayType } from './get-day-type';

interface Period {
  start: Date;
  end: Date;
  season: 'winter' | 'summer' | 'transition';
  dayType: DayType;
}

// TODO: 
function isWithinRange(date: Date, start: Date, end: Date): boolean {
  const month = date.getMonth() + 1; // JavaScript months are 0-based
  const day = date.getDate();
  
  // Create comparison values in MMDD format
  const dateNum = month * 100 + day;
  const startNum = start.getMonth() * 100 + start.getDate();
  const endNum = end.getMonth() * 100 + end.getDate();
  
  return dateNum >= startNum && dateNum <= endNum;
}

function getSeason(date: Date): 'winter' | 'summer' | 'transition' {
  // Winter: November 1 - March 20
  if (isWithinRange(date, winterStart, winterEnd)) {
    return 'winter';
  }
  
  // Summer: May 15 - September 14
  if (isWithinRange(date, summerStart, summerEnd)) {
    return 'summer';
  }
  
  // Transition: March 21 - May 14 and September 15 - October 31
  if (isWithinRange(date, transition1Start, transition1End) || isWithinRange(date, transition2Start, transition2End)) {
    return 'transition';
  }

  return 'winter';
}

/**
 * Splits a time period into daily segments, each with its corresponding season and day type
 */
export function splitPeriod(startDate: Date, endDate: Date): Period[] {
  const periods: Period[] = [];
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    // Create start and end times for this day
    const dayStart = new Date(currentDate);
    const dayEnd = new Date(currentDate);
    dayEnd.setHours(23, 59, 59, 999);

    // If this is the first day, use the actual start time
    if (currentDate.getTime() === startDate.getTime()) {
      dayStart.setTime(startDate.getTime());
    } else {
      dayStart.setHours(0, 0, 0, 0);
    }

    // If this is the last day, use the actual end time
    if (dayEnd > endDate) {
      dayEnd.setTime(endDate.getTime());
    }

    periods.push({
      start: dayStart,
      end: dayEnd,
      season: getSeason(currentDate),
      dayType: getDayType(currentDate)
    });

    // Move to next day
    currentDate.setDate(currentDate.getDate() + 1);
    currentDate.setHours(0, 0, 0, 0);
  }

  return periods;
}
