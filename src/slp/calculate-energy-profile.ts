import { splitPeriod } from './split-period';
import { getProfile } from './get-profile';
import { calculateEnergyConsumption } from './calculate-energy-consumption';

interface EnergyProfileResult {
  startTime: Date;
  endTime: Date;
  values: number[];
  resolution: 'quarter' | 'hour';
}

/**
 * Calculates the energy profile for a given time period
 * 
 * @param startTime - Start time of the period
 * @param endTime - End time of the period
 * @param resolution - Time resolution of the results ('quarter' for 15-min intervals, 'hour' for hourly intervals)
 * @returns Array of energy consumption values in kWh for the specified period and resolution
 */
export function calculateEnergyProfile(
  startTime: Date,
  endTime: Date,
  resolution: 'quarter' | 'hour'
): EnergyProfileResult {
  // Split the period into segments based on season and day type
  const periods = splitPeriod(startTime, endTime);
  
  // Calculate energy consumption for each period and combine results
  const results: number[] = [];
  
  for (const period of periods) {
    // Get the appropriate load profile for this period
    const profile = getProfile(period.season, period.dayType);
    
    // Calculate energy consumption for this period
    const periodConsumption = calculateEnergyConsumption(
      period.start,
      period.end,
      profile.values,
      resolution
    );
    
    results.push(...periodConsumption);
  }

  return {
    startTime,
    endTime,
    values: results,
    resolution
  };
}
