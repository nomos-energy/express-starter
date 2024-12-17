import { calculateEnergyProfile } from '../calculate-energy-profile';
import { splitPeriod } from '../split-period';
import { getDayType } from '../get-day-type';
import { getProfile } from '../get-profile';
import { HOLIDAYS } from '../constants';

describe('Standard Load Profile Calculations', () => {
  describe('calculateEnergyProfile', () => {
    it('should return correct number of values for a 24-hour period', () => {
      const startTime = new Date('2024-01-01T00:00:00Z');
      const endTime = new Date('2024-01-01T23:59:59Z');
      
      const hourlyProfile = calculateEnergyProfile(startTime, endTime, 'hour');
      const quarterProfile = calculateEnergyProfile(startTime, endTime, 'quarter');
      
      expect(hourlyProfile.values.length).toBe(24); // 24 hours
      expect(quarterProfile.values.length).toBe(96); // 96 quarter hours
    });

    it('should return correct number of values for a partial day', () => {
      const startTime = new Date('2024-01-01T12:00:00Z');
      const endTime = new Date('2024-01-01T18:00:00Z');
      
      const hourlyProfile = calculateEnergyProfile(startTime, endTime, 'hour');
      const quarterProfile = calculateEnergyProfile(startTime, endTime, 'quarter');
      
      expect(hourlyProfile.values.length).toBe(6); // 6 hours
      expect(quarterProfile.values.length).toBe(24); // 24 quarters
    });

    it('should handle multi-day periods correctly', () => {
      const startTime = new Date('2024-01-01T12:00:00Z');
      const endTime = new Date('2024-01-03T12:00:00Z');
      
      const hourlyProfile = calculateEnergyProfile(startTime, endTime, 'hour');
      
      // 48 hours total (12 hours day 1 + 24 hours day 2 + 12 hours day 3)
      expect(hourlyProfile.values.length).toBe(48);
    });
  });

  describe('splitPeriod', () => {
    it('should correctly identify winter period', () => {
      const date = new Date('2024-01-15T12:00:00Z'); // January is winter
      const periods = splitPeriod(date, date);
      
      expect(periods[0].season).toBe('winter');
    });

    it('should correctly identify summer period', () => {
      const date = new Date('2024-06-15T12:00:00Z'); // June is summer
      const periods = splitPeriod(date, date);
      
      expect(periods[0].season).toBe('summer');
    });

    it('should correctly identify transition period', () => {
      const date = new Date('2024-04-01T12:00:00Z'); // April is transition
      const periods = splitPeriod(date, date);
      
      expect(periods[0].season).toBe('transition');
    });
  });

  describe('getDayType', () => {
    it('should identify weekdays correctly', () => {
      const wednesday = new Date('2024-01-03T12:00:00Z'); // A Wednesday
      expect(getDayType(wednesday)).toBe('weekday');
    });

    it('should identify saturdays correctly', () => {
      const saturday = new Date('2024-01-06T12:00:00Z'); // A Saturday
      expect(getDayType(saturday)).toBe('saturday');
    });

    it('should identify sundays correctly', () => {
      const sunday = new Date('2024-01-07T12:00:00Z'); // A Sunday
      expect(getDayType(sunday)).toBe('sunday');
    });

    it('should treat holidays as sundays', () => {
      const newYear = new Date('2024-01-01T12:00:00Z'); // New Year's Day
      expect(getDayType(newYear)).toBe('sunday');
      expect(HOLIDAYS).toContain('2024-01-01');
    });
  });

  describe('getProfile', () => {
    it('should return correct profile structure', () => {
      const profile = getProfile('winter', 'weekday');
      
      expect(profile).toHaveProperty('season', 'winter');
      expect(profile).toHaveProperty('dayType', 'weekday');
      expect(profile).toHaveProperty('values');
      expect(profile.values).toHaveLength(96);
    });

    it('should return different profiles for different day types', () => {
      const weekdayProfile = getProfile('winter', 'weekday');
      const saturdayProfile = getProfile('winter', 'saturday');
      const sundayProfile = getProfile('winter', 'sunday');
      
      // Profiles should be different for different day types
      expect(weekdayProfile.values).not.toEqual(saturdayProfile.values);
      expect(weekdayProfile.values).not.toEqual(sundayProfile.values);
      expect(saturdayProfile.values).not.toEqual(sundayProfile.values);
    });

    it('should return different profiles for different seasons', () => {
      const winterProfile = getProfile('winter', 'weekday');
      const summerProfile = getProfile('summer', 'weekday');
      const transitionProfile = getProfile('transition', 'weekday');
      
      // Profiles should be different for different seasons
      expect(winterProfile.values).not.toEqual(summerProfile.values);
      expect(winterProfile.values).not.toEqual(transitionProfile.values);
      expect(summerProfile.values).not.toEqual(transitionProfile.values);
    });
  });
}); 