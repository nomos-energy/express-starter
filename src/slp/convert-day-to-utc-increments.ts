/**
 * Converts a given day into an array of UTC timestamps at 15-minute intervals
 * 
 * This function takes a date and generates 96 timestamps (one for each 15-minute period in a day)
 * aligned with the Standard Load Profile (SLP) data structure. The timestamps are in UTC to ensure
 * consistent data handling across different timezones.
 * 
 * @param startTime - The start time of the period
 * @param endTime - The end time of the period
 * @returns Array<Date> - Array of 96 UTC timestamps representing each 15-minute interval of the day
 * 
 * This aligns with the SLP data structure where each profile contains 96 values
 * representing power consumption at 15-minute intervals throughout a 24-hour period.
 */
export function convertToUtcIncrementsBetweenTimes(startTime: Date, endTime: Date): Date[] {
  const increments: Date[] = [];

  // Convert start and end times to UTC equivalents
  const startUTC = Date.UTC(
    startTime.getUTCFullYear(),
    startTime.getUTCMonth(),
    startTime.getUTCDate(),
    startTime.getUTCHours(),
    startTime.getUTCMinutes(),
    startTime.getUTCSeconds(),
    startTime.getUTCMilliseconds()
  );

  const endUTC = Date.UTC(
    endTime.getUTCFullYear(),
    endTime.getUTCMonth(),
    endTime.getUTCDate(),
    endTime.getUTCHours(),
    endTime.getUTCMinutes(),
    endTime.getUTCSeconds(),
    endTime.getUTCMilliseconds()
  );

  // Ensure start time is before or equal to end time
  if (startUTC > endUTC) {
    throw new Error("Start time must be before or equal to end time.");
  }

  // Push 15-minute increments between startUTC and endUTC
  let currentUTC = startUTC;
  while (currentUTC <= endUTC) {
    increments.push(new Date(currentUTC)); // Add current UTC timestamp
    currentUTC += 15 * 60 * 1000; // Add 15 minutes in milliseconds
  }

  return increments;
}

