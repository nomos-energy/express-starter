import { convertToUtcIncrementsBetweenTimes } from './convert-day-to-utc-increments';

/**
 * Calculates energy consumption for a given time period using a Standard Load Profile
 * 
 * @param startTime - Start time of the period (in any timezone)
 * @param endTime - End time of the period (in any timezone)
 * @param profile - Array of 96 values representing power consumption in 15-minute intervals for a day in German time
 * @returns number[] - Array of profile values corresponding to the requested time period
 */
function getProfileValues(
  startTime: Date,
  endTime: Date,
  profile: number[]
): number[] {
  // Validate profile length
  if (profile.length !== 96) {
    throw new Error('Profile must contain exactly 96 values (24 hours * 4 quarters)');
  }

  // Get UTC timestamps for the requested period
  const utcIncrements = convertToUtcIncrementsBetweenTimes(startTime, endTime);

  // Convert each UTC timestamp to German time and map to profile value
  return utcIncrements.map(utcTime => {
    // Convert to German time
    const germanTime = new Date(utcTime.toLocaleString('en-US', { timeZone: 'Europe/Berlin' }));
    
    // Calculate the index in the profile (96 intervals per day)
    const minutes = germanTime.getHours() * 60 + germanTime.getMinutes();
    const intervalIndex = Math.floor(minutes / 15);
    
    return profile[intervalIndex];
  });
}


const calculateEnergyConsumption = (
  startTime: Date,
  endTime: Date,
  profile: number[],
  resolution: 'quarter' | 'hour'
): number[] => {
  // calculate the energy consumption in kWh
  const energyConsumption15Minutes = getProfileValues(startTime, endTime, profile).map(value => 0.25 * value / 1000);

  // return the energy consumption in kWh

  if (resolution === 'quarter') {
    return energyConsumption15Minutes;
  }

  // sum the energy consumption in kWh for each hour
  else if (resolution === 'hour') {
    const energyConsumption1Hour = [];
    for (let i = 0; i < energyConsumption15Minutes.length; i += 4) {
      energyConsumption1Hour.push(energyConsumption15Minutes[i] + energyConsumption15Minutes[i + 1] + energyConsumption15Minutes[i + 2] + energyConsumption15Minutes[i + 3]);
    }
    return energyConsumption1Hour;
  }
  else {
    throw new Error('Invalid resolution');
  }
};

export { calculateEnergyConsumption };
