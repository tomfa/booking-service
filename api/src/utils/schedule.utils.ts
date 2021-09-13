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
  isValidDate,
  msOfDay,
  msUntilClosed,
  setTimeOfDay,
  splitHourMinuteOfDay,
  startOfNextDay,
  toGQLDate,
} from './date.utils';
import { HourMinuteString } from './types';
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

const generateSeatNumbers = (numSeats: number): number[] =>
  new Array(numSeats).fill(undefined).map((_, i) => i);

export const convertDateToTimeSlot = (
  resource: Resource,
  time: Date
): TimeSlot => {
  const schedule = getOpeningHoursForDate(resource, time);
  return {
    availableSeats: resource.seats,
    start: toGQLDate(time),
    end: toGQLDate(time) + 60 * schedule.slotDurationMinutes,
    seatsAvailable: generateSeatNumbers(resource.seats),
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
  day: Date,
  tz: string
): Date | undefined => {
  if (isClosedAllDay(openingHours)) {
    return undefined;
  }
  return setTimeOfDay(day, tz, splitHourMinute(openingHours.start));
};
export const isBeforeOpeningHours = (
  openingHours: HourSchedule,
  date: Date,
  tz: string
): boolean => {
  const { hour: startHour, minute: startMinute } = splitHourMinute(
    openingHours.start
  );
  const { hour, minute } = splitHourMinuteOfDay(date, tz);
  const bookingDiffFromOpeningMinutes =
    hour * 60 + minute - (startHour * 60 + startMinute);
  return bookingDiffFromOpeningMinutes < 0;
};

const diffMsUntilSlotStart = (
  openingHours: HourSchedule,
  date: Date,
  tz: string
): number => {
  const { hour: startHour, minute: startMinute } = splitHourMinute(
    openingHours.start
  );
  const slotIntervalMs = openingHours.slotIntervalMinutes * 60 * 1000;
  const dayMS = msOfDay(date, tz);
  const bookingStartAsMsOfDay =
    startHour * 3600 * 1000 - startMinute * 60 * 1000;
  const diffFromStartOfBookingDay = dayMS - bookingStartAsMsOfDay;
  const offsetFromSlotStart = diffFromStartOfBookingDay % slotIntervalMs;
  if (offsetFromSlotStart === 0) {
    return 0;
  }
  return slotIntervalMs - offsetFromSlotStart;
};

export const isClosedAllDay = (schedule: HourSchedule) => {
  return schedule.start === '';
};
export const findNextValidTimeSlotStart = (
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
  if (isClosedAllDay(openingHours)) {
    return findNextValidTimeSlotStart(
      resource,
      startOfNextDay(date, resource.timezone),
      max
    );
  }
  if (isBeforeOpeningHours(openingHours, date, resource.timezone)) {
    return firstSlotOfDay(openingHours, date, resource.timezone);
  }
  const diffMsUntilSlot = diffMsUntilSlotStart(
    openingHours,
    date,
    resource.timezone
  );
  if (diffMsUntilSlot > 0) {
    return findNextValidTimeSlotStart(
      resource,
      new Date(date.getTime() + diffMsUntilSlot),
      max
    );
  }
  if (msUntilClosed(openingHours, date, resource.timezone) <= 0) {
    const nextDay = startOfNextDay(date, resource.timezone);
    return findNextValidTimeSlotStart(resource, nextDay, max);
  }
  return date;
};
export const bookingSlotFitsInResourceSlots = (
  resource: Resource,
  booking: Booking
): boolean => {
  const openingHours = getOpeningHoursForDate(
    resource,
    fromGQLDate(booking.start)
  );
  if (isClosedAllDay(openingHours)) {
    return false;
  }

  const { hour: startHour, minute: startMinute } = splitHourMinute(
    openingHours.start
  );
  const { hour: bookHour, minute: bookMinute } = splitHourMinuteOfDay(
    fromGQLDate(booking.start),
    resource.timezone
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
const slotCache: Record<
  string,
  { slots: TimeSlot[]; startSeconds: number }
> = {};
export const constructSlotsForDay = ({
  resource,
  date,
}: {
  resource: Resource;
  date: Date;
}): TimeSlot[] => {
  const openingHours = getOpeningHoursForDate(resource, date);
  if (isClosedAllDay(openingHours) || !resource.enabled) {
    return [];
  }
  const startSeconds =
    setTimeOfDay(
      date,
      resource.timezone,
      splitHourMinute(openingHours.start)
    ).getTime() / 1000;

  const cacheKey = `${openingHours.start}-${openingHours.end}-${openingHours.slotIntervalMinutes}-${openingHours.slotDurationMinutes}`;
  if (slotCache[cacheKey]) {
    const startDiff = startSeconds - slotCache[cacheKey].startSeconds;
    return slotCache[cacheKey].slots.map(s => ({
      ...s,
      availableSeats: resource.seats,
      start: s.start + startDiff,
      end: s.end + startDiff,
    }));
  }

  let endSeconds =
    setTimeOfDay(
      date,
      resource.timezone,
      splitHourMinute(openingHours.end)
    ).getTime() / 1000;
  if (openingHours.end === '00:00') {
    endSeconds += 24 * 3600;
  }
  const slots: TimeSlot[] = [];
  const slotDurationSeconds = openingHours.slotDurationMinutes * 60;
  const slotIntervalSeconds = openingHours.slotIntervalMinutes * 60;
  let cursor = startSeconds;
  while (cursor + slotDurationSeconds <= endSeconds) {
    slots.push({
      start: cursor,
      end: cursor + slotDurationSeconds,
      availableSeats: resource.seats,
      seatsAvailable: [],
    });
    cursor += slotIntervalSeconds;
  }
  slotCache[cacheKey] = { startSeconds, slots };
  return slots;
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
  let timeslots: TimeSlot[] = [];
  let cursor = from;
  const dateAfterToDate = startOfNextDay(to, resource.timezone);
  while (cursor < dateAfterToDate) {
    timeslots = timeslots.concat(
      constructSlotsForDay({ resource, date: cursor })
    );
    cursor = new Date(cursor.getTime() + 24 * 3600 * 1000);
  }
  const startSeconds = Math.floor(from.getTime() / 1000);
  const endSeconds = Math.floor(to.getTime() / 1000);
  const filtered = timeslots.filter(
    t => t.start >= startSeconds && t.end <= endSeconds
  );
  return filtered;
};
