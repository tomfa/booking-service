import { HourSchedule } from '../graphql/generated/types';
import {
  getDayOfWeek,
  getIsoDate,
  msOfDay,
  msUntilClosed,
  setTimeOfDay,
  splitHourMinuteOfDay,
} from './date.utils';

describe('date.utils', () => {
  describe('msOfDay', () => {
    test('returns ms of that day in local timezone', () => {
      const midnightUTC = new Date('2021-01-01T00:00:00Z'); // 1 AM in Oslo
      expect(msOfDay(midnightUTC, 'Europe/Oslo')).toBe(3600 * 1000);
    });
  });
  describe('setTimeOfDay', () => {
    it('returns a date with time in local timezone', () => {
      const day = new Date('2021-07-01T00:00:00Z');
      const localTime2AM = setTimeOfDay(day, 'Europe/Oslo', {
        hour: 4,
        minute: 0,
      });
      expect(localTime2AM.toISOString()).toBe('2021-07-01T02:00:00.000Z');
    });
    it('works with winter time', () => {
      const day = new Date('2021-02-01T00:00:00Z');
      const localTime2AM = setTimeOfDay(day, 'Europe/Oslo', {
        hour: 3,
        minute: 0,
      });
      expect(localTime2AM.toISOString()).toBe('2021-02-01T02:00:00.000Z');
    });
    it('handles timezone date offset', () => {
      const day = new Date('2021-07-31T23:00:00Z'); // 1st of August local time
      const localTime2AM = setTimeOfDay(day, 'Europe/Oslo', {
        hour: 2,
        minute: 0,
      });
      expect(localTime2AM.toISOString()).toBe('2021-08-01T00:00:00.000Z');
    });
    it('handles minutes', () => {
      const date = new Date('2021-06-21T02:00:00.000Z');
      const tz = 'Africa/Accra';
      const closingTime = setTimeOfDay(date, tz, { hour: 23, minute: 59 });
      expect(closingTime.toISOString()).toBe('2021-06-21T23:59:00.000Z');
    });
  });
  describe('msUntilLastSlotBegins', () => {
    const openingHour: HourSchedule = {
      start: '08:00',
      end: '16:00',
      slotIntervalMinutes: 30,
      slotDurationMinutes: 60,
    };
    test('returns milliseconds until resource closes that day', () => {
      const timezone = 'Europe/Oslo';
      const now = new Date('2021-07-01T10:00:00Z');
      const result = msUntilClosed(openingHour, now, timezone);
      const expected = (6 - 2) * 3600 * 1000; // 2 hour timezone offset
      expect(result).toBe(expected);
    });
  });
  describe('getDayOfWeek', () => {
    it('returns day of week, 0 indexed from sunday', () => {
      const dowOslo = getDayOfWeek(
        new Date('2021-09-11T23:30:00Z'),
        'Europe/Oslo'
      );
      const dowNewYork = getDayOfWeek(
        new Date('2021-09-11T23:30:00Z'),
        'America/New_York'
      );
      expect(dowOslo).toBe(0);
      expect(dowNewYork).toBe(6);
    });
  });
  describe('getIsoDate', () => {
    it('returns the iso date, in the related timezone', () => {
      const isoDateOslo = getIsoDate(
        new Date('2021-09-11T23:30:00Z'),
        'Europe/Oslo'
      );
      const isoDateNewYork = getIsoDate(
        new Date('2021-09-11T23:30:00Z'),
        'America/New_York'
      );
      expect(isoDateOslo).toBe('2021-09-12');
      expect(isoDateNewYork).toBe('2021-09-11');
    });
  });
  describe('splitHourMinuteOfDay', () => {
    test('returns hour and minute in local time', () => {
      const date = new Date('2021-09-13T00:00:00Z');
      expect(splitHourMinuteOfDay(date, 'Europe/Oslo')).toEqual({
        hour: 2,
        minute: 0,
      });
      expect(splitHourMinuteOfDay(date, 'America/New_York')).toEqual({
        hour: 20,
        minute: 0,
      });
    });
  });
});
