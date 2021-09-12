import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { Booking, HourSchedule, TimeSlot } from '../graphql/generated/types';
import { IsoDate } from './types';
import { splitHourMinute } from './schedule.utils';

dayjs.extend(utc);
dayjs.extend(timezone);

export const fromGQLDate = (seconds: number): Date => new Date(seconds * 1000);
export const toGQLDate = (date: Date): number =>
  Math.floor(date.getTime() / 1000);
export const getIsoDate = (date: Date, tz: string): IsoDate => {
  return dayjs(date).tz(tz).format('YYYY-MM-DD');
};
export const startOfNextDay = (date: Date, tz: string): Date => {
  const thisDay = dayjs.tz(getIsoDate(date, tz), tz);
  return thisDay.add(1, 'day').toDate();
};
export const splitHourMinuteOfDay = (
  date: Date,
  tz: string
): { hour: number; minute: number } => {
  const d = dayjs(date, tz);
  return { hour: d.hour(), minute: d.minute() };
};

export const msUntilClosed = (
  openingHours: HourSchedule,
  date: Date,
  tz: string
): number => {
  const closingTime = setTimeOfDay(date, tz, splitHourMinute(openingHours.end));
  const closesMs = msOfDay(closingTime, tz);
  const currentMS = msOfDay(date, tz);
  return closesMs - currentMS;
};

export const msOfDay = (date: Date, tz: string): number => {
  const d = dayjs.tz(date, tz);
  return (
    d.hour() * 3600 * 1000 +
    d.minute() * 60 * 1000 +
    d.second() * 1000 +
    d.millisecond()
  );
};

export function isValidTimeZone(tz: string) {
  if (!Intl || !Intl.DateTimeFormat().resolvedOptions().timeZone) {
    throw new Error('Time zones are not available in this environment');
  }

  try {
    Intl.DateTimeFormat(undefined, { timeZone: tz });
    return true;
  } catch (ex) {
    return false;
  }
}

export const reduceAvailability = (
  tempSlots: TimeSlot[],
  bookings: Booking[]
): TimeSlot[] => {
  let updatedSlots = tempSlots.slice();
  bookings.forEach(booking => {
    // TODO: inefficient
    updatedSlots = updatedSlots.map(slot => {
      const overlaps = slot.start < booking.end && slot.end > booking.start;
      if (overlaps) {
        return {
          ...slot,
          availableSeats: slot.availableSeats - 1,
          seatsAvailable: slot.seatsAvailable.filter(
            s => !booking.seatNumbers.includes(s)
          ),
        };
      }
      return slot;
    });
  });
  return updatedSlots;
};
export const isValidDate = (date: Date): boolean =>
  !Number.isNaN(date.getTime());

export const setTimeOfDay = (
  date: Date,
  tz: string,
  time: { hour: number; minute: number }
): Date =>
  dayjs
    .tz(getIsoDate(date, tz), tz)
    .set('hour', time.hour)
    .set('minute', time.minute)
    .toDate();

export const getDayOfWeek = (date: Date, tz: string): number => {
  // TODO: Add and use a Weekday enum from shared package
  return dayjs(date).tz(tz).day();
};
