import profiles from './load-profile';
import { DayType } from './get-day-type';

export interface LoadProfile {
  season: 'winter' | 'summer' | 'transition';
  dayType: DayType;
  values: number[];
}

export function getProfile(season: 'winter' | 'summer' | 'transition', dayType: DayType): LoadProfile {
  return {
    season,
    dayType,
    values: profiles[season][dayType],
  };
}
