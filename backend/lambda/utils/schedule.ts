import {
  Booking,
  HourSchedule,
  Resource,
  Schedule,
  TimeSlot,
} from '../../graphql/generated/types';
import { getOpeningHoursForDate } from './resource.utils';
import {
  fromGQLDate,
  getIsoDate,
  splitHourMinuteOfDay,
  toGQLDate,
} from './date.utils';
import { HourMinuteString, IsoDate } from './types';
import { validateHourMinute } from './validation.utils';
import { BadRequestError, ErrorCode } from './errors';

export const closed: HourSchedule = {
  start: '',
  end: '',
  slotIntervalMinutes: 0,
  slotDurationMinutes: 0,
};
export const closedSchedule: Schedule = {
  mon: closed,
  tue: closed,
  wed: closed,
  thu: closed,
  fri: closed,
  sat: closed,
  sun: closed,
  overriddenDates: [],
};
export const getCurrentTimeSlot = (
  resource: Resource,
  time: Date
): TimeSlot | undefined => {
  if (!isWithinOpeningHours(resource, time)) {
    return undefined;
  }
  const schedule = getOpeningHoursForDate(resource, time);
  if (!isOpen(schedule)) {
    return undefined;
  }
  return {
    availableSeats: resource.seats,
    start: toGQLDate(time),
    end: toGQLDate(time) + 60 * schedule.slotDurationMinutes,
  };
};
export const isWithinOpeningHours = (
  resource: Resource,
  time: Date
): boolean => {
  const openingHours = getOpeningHoursForDate(resource, time);
  if (!isOpen(openingHours)) {
    return false;
  }
  if (openingHours.start === openingHours.end) {
    return false;
  }
  const { hour: startHour, minute: startMinute } = splitHourMinute(
    openingHours.start
  );
  const { hour: endHour, minute: endMinute } = splitHourMinute(
    openingHours.end
  );
  const { hour: bookHour, minute: bookMinute } = splitHourMinuteOfDay(time);
  // Note: Able to book _at_ opening hour
  if (bookHour * 60 + bookMinute < startHour * 60 + startMinute) {
    return false;
  }
  // Note: Not able to book _at_ closing hour
  if (bookHour * 60 + bookMinute >= endHour * 60 + endMinute) {
    return false;
  }
  return true;
};
export const splitHourMinute = (
  hourMinute: HourMinuteString
): { hour: number; minute: number } => {
  validateHourMinute(hourMinute);
  const [hourStr, minuteStr] = hourMinute.split(':');
  const hour = parseInt(hourStr);
  const minute = parseInt(minuteStr);
  return { hour, minute };
};
const firstSlotOfDay = (
  openingHours: HourSchedule,
  day: IsoDate
): Date | undefined => {
  if (!isOpen(openingHours)) {
    return undefined;
  }
  return new Date(`${day}T${openingHours.start}:00Z`);
};
export const isBeforeOpeningHours = (
  openingHours: HourSchedule,
  date: Date
): boolean => {
  const { hour: startHour, minute: startMinute } = splitHourMinute(
    openingHours.start
  );
  const { hour, minute } = splitHourMinuteOfDay(date);
  const bookingDiffFromOpeningMinutes =
    hour * 60 + minute - (startHour * 60 + startMinute);
  return bookingDiffFromOpeningMinutes < 0;
};
export const isAfterOpeningHours = (
  openingHours: HourSchedule,
  date: Date
): boolean => {
  const { hour: endHour, minute: endMinute } = splitHourMinute(
    openingHours.end
  );
  const { hour, minute } = splitHourMinuteOfDay(date);
  const minutesUntilClosing = endHour * 60 + endMinute - (hour * 60 + minute);
  // Note: _at_ closing time will be considered closed
  return minutesUntilClosing <= 0;
};
const roundUpToNextSlotStart = (
  openingHours: HourSchedule,
  date: Date
): Date => {
  const { hour: startHour, minute: startMinute } = splitHourMinute(
    openingHours.start
  );
  const { hour, minute } = splitHourMinuteOfDay(date);
  const bookingDiffFromOpeningMinutes =
    hour * 60 + minute - (startHour * 60 + startMinute);
  const remainder =
    bookingDiffFromOpeningMinutes % openingHours.slotIntervalMinutes;
  if (remainder === 0) {
    return new Date(
      date.getTime() + openingHours.slotIntervalMinutes * 60 * 1000
    );
  }
  const minutesToAdd = openingHours.slotIntervalMinutes - remainder;
  const cleanedDate = new Date(date.getTime() + minutesToAdd * 60 * 1000);
  cleanedDate.setSeconds(0, 0);
  return cleanedDate;
};
const startOfNextDay = (date: Date): Date => {
  const thisDay = new Date(getIsoDate(date));
  return new Date(thisDay.getTime() + 24 * 3600 * 1000);
};
export const isOpen = (scheudle: HourSchedule): scheudle is HourSchedule => {
  return scheudle.start !== '';
};
const getNextTimeslotAfter = (
  resource: Resource,
  date: Date,
  max: Date
): Date | undefined => {
  if (!resource.enabled) {
    return undefined;
  }
  if (Number.isNaN(date.getTime())) {
    throw new Error(`nextBookingSlotHour: Invalid date passed.`);
  }
  const openingHours = getOpeningHoursForDate(resource, date);
  if (!isOpen(openingHours)) {
    const nextDay = startOfNextDay(date);
    if (nextDay > max) {
      return undefined;
    }
    return getNextTimeslotAfter(resource, nextDay, max);
  }
  if (isBeforeOpeningHours(openingHours, date)) {
    return firstSlotOfDay(openingHours, getIsoDate(date));
  }
  const cleanedDate = roundUpToNextSlotStart(openingHours, date);
  const nextDay = startOfNextDay(date);
  if (isAfterOpeningHours(openingHours, cleanedDate)) {
    if (nextDay > max) {
      return undefined;
    }
    return getNextTimeslotAfter(resource, nextDay, max);
  }
  const end = new Date(
    cleanedDate.getTime() + openingHours.slotDurationMinutes * 60 * 1000 - 60
  );
  if (isAfterOpeningHours(openingHours, end)) {
    return getNextTimeslotAfter(resource, nextDay, max);
  }
  return cleanedDate;
};
export const bookingSlotFitsInResourceSlots = (
  resource: Resource,
  booking: Booking
): boolean => {
  const bookingDurationMinutes = (booking.end - booking.start) / 60;
  const openingHours = getOpeningHoursForDate(
    resource,
    fromGQLDate(booking.start)
  );
  if (!isOpen(openingHours)) {
    return false;
  }

  const { hour: startHour, minute: startMinute } = splitHourMinute(
    openingHours.start
  );
  const { hour: bookHour, minute: bookMinute } = splitHourMinuteOfDay(
    fromGQLDate(booking.start)
  );
  const bookingDiffFromOpeningMinutes =
    bookHour * 60 + bookMinute - (startHour * 60 + startMinute);

  if (bookingDiffFromOpeningMinutes < 0) {
    return false;
  }
  if (bookingDiffFromOpeningMinutes % openingHours.slotIntervalMinutes !== 0) {
    return false;
  }
  if (bookingDurationMinutes !== openingHours.slotDurationMinutes) {
    throw new BadRequestError(
      `Booking length ${bookingDurationMinutes}min does not fit into opening hours at ${getIsoDate(
        fromGQLDate(booking.start)
      )} for resource ${resource.id}`,
      ErrorCode.INVALID_BOOKING_ARGUMENTS
    );
  }
  return true;
};
export const constructAllSlots = ({
  resource,
  from,
  to,
}: {
  resource: Resource;
  from: Date;
  to: Date;
}): TimeSlot[] => {
  if (!resource.enabled) {
    return [];
  }
  const timeslots: TimeSlot[] = [];
  const immediatlyBeforeFrom = new Date(from.getTime() - 1);
  let cursor = getNextTimeslotAfter(resource, immediatlyBeforeFrom, to);

  while (cursor && cursor < to) {
    const currentTimeSlot = getCurrentTimeSlot(resource, cursor);
    if (currentTimeSlot) {
      timeslots.push(currentTimeSlot);
    }
    cursor = getNextTimeslotAfter(resource, cursor, to);
  }
  return timeslots;
};
