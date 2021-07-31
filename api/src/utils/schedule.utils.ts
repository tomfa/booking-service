import {
  Booking,
  HourSchedule,
  Resource,
  Schedule,
  TimeSlot,
} from '../graphql/generated/types';
import { getOpeningHoursForDate } from './resource.utils';
import {
  fromGQLDate,
  getIsoDate,
  isValidDate,
  msOfDay,
  splitHourMinuteOfDay,
  toGQLDate,
} from './date.utils';
import { HourMinuteString, IsoDate } from './types';
import { validateHourMinute } from './validation.utils';
import { GenericBookingError } from './errors';

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
export const convertDateToTimeSlot = (
  resource: Resource,
  time: Date
): TimeSlot => {
  const schedule = getOpeningHoursForDate(resource, time);
  return {
    availableSeats: resource.seats,
    start: toGQLDate(time),
    end: toGQLDate(time) + 60 * schedule.slotDurationMinutes,
  };
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
export const msUntilClosing = (
  openingHours: HourSchedule,
  date: Date
): number => {
  const { hour: endHour, minute: endMinute } = splitHourMinute(
    openingHours.end
  );
  let closingTimeMs = endHour * 3600 * 1000 + endMinute * 60 * 1000;
  const isMidnight = closingTimeMs === 0;
  if (isMidnight) {
    closingTimeMs = 24 * 3600 * 1000;
  }
  return closingTimeMs - msOfDay(date);
};
const diffMsUntilSlotStart = (
  openingHours: HourSchedule,
  date: Date
): number => {
  const { hour: startHour, minute: startMinute } = splitHourMinute(
    openingHours.start
  );
  const slotIntervalMs = openingHours.slotIntervalMinutes * 60 * 1000;
  const dayMS = msOfDay(date);
  const bookingStartAsMsOfDay =
    startHour * 3600 * 1000 - startMinute * 60 * 1000;
  const diffFromStartOfBookingDay = dayMS - bookingStartAsMsOfDay;
  const offsetFromSlotStart = diffFromStartOfBookingDay % slotIntervalMs;
  if (offsetFromSlotStart === 0) {
    return 0;
  }
  return slotIntervalMs - offsetFromSlotStart;
};
const startOfNextDay = (date: Date): Date => {
  const isoDay = getIsoDate(date);
  const thisDay = new Date(`${isoDay}T00:00:00Z`);
  return new Date(thisDay.getTime() + 24 * 3600 * 1000);
};
export const isOpen = (scheudle: HourSchedule): scheudle is HourSchedule => {
  return scheudle.start !== '';
};
const findNextValidTimeSlot = (
  resource: Resource,
  date: Date,
  max: Date
): Date | undefined => {
  if (!resource.enabled) {
    return undefined;
  }
  if (!isValidDate(date) || !isValidDate(max)) {
    throw new Error(`nextBookingSlotHour: Invalid date passed.`);
  }
  if (date > max) {
    return undefined;
  }
  const openingHours = getOpeningHoursForDate(resource, date);
  if (!isOpen(openingHours)) {
    return findNextValidTimeSlot(resource, startOfNextDay(date), max);
  }
  if (isBeforeOpeningHours(openingHours, date)) {
    return firstSlotOfDay(openingHours, getIsoDate(date));
  }
  const diffMsUntilSlot = diffMsUntilSlotStart(openingHours, date);
  if (diffMsUntilSlot > 0) {
    return findNextValidTimeSlot(
      resource,
      new Date(date.getTime() + diffMsUntilSlot),
      max
    );
  }
  if (msUntilClosing(openingHours, date) <= 0) {
    const nextDay = startOfNextDay(date);
    return findNextValidTimeSlot(resource, nextDay, max);
  }
  return date;
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
  // Do this check for non-admin users
  // if (bookingDurationMinutes !== openingHours.slotDurationMinutes) {
  //   throw new BadRequestError(
  //     `Booking length ${bookingDurationMinutes}min does not fit into opening hours at ${getIsoDate(
  //       fromGQLDate(booking.start)
  //     )} for resource ${resource.id}`,
  //     ErrorCode.INVALID_BOOKING_ARGUMENTS
  //   );
  // }
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
  if (!isValidDate(from) || !isValidDate(to)) {
    throw new GenericBookingError(
      `Received invalid date range to construct slots form`
    );
  }
  if (!resource.enabled) {
    return [];
  }
  const timeslots: TimeSlot[] = [];
  let cursor = findNextValidTimeSlot(resource, from, to);
  while (cursor && cursor < to) {
    const currentTimeSlot = convertDateToTimeSlot(resource, cursor);
    timeslots.push(currentTimeSlot);
    cursor = findNextValidTimeSlot(
      resource,
      new Date(cursor.getTime() + 1),
      to
    );
  }
  return timeslots;
};
