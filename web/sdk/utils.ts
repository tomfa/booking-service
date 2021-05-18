import {
  Booking,
  HourMinute,
  IsoDate,
  OpeningHour,
  Resource,
  TimeSlot,
} from './BookingAPI.types';
import { BadRequestError, ErrorCode, GenericBookingError } from './errors';

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

export const getCurrentTimeSlot = (
  resource: Resource,
  time: Date
): TimeSlot | undefined => {
  if (!isWithinOpeningHours(resource, time)) {
    return undefined;
  }
  const schedule = getOpeningHoursForDate(resource, time);
  return {
    availableSeats: resource.seats,
    start: time,
    end: new Date(time.getTime() + 1000 * 60 * schedule.slotDurationMinutes),
  };
};

export const isWithinOpeningHours = (
  resource: Resource,
  time: Date
): boolean => {
  const openingHours = getOpeningHoursForDate(resource, time);
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
        return { ...slot, availableSeats: slot.availableSeats - 1 };
      }
      return slot;
    });
  });
  return updatedSlots;
};

export const getBookingDurationMinutes = (booking: Booking): number => {
  const milliDiff = booking.end.getTime() - booking.start.getTime();
  return Math.floor(milliDiff / (60 * 1000));
};

export const openingHourGenerator = ({
  slotInterval,
  slotDuration,
}: {
  slotInterval: number;
  slotDuration: number;
}) => ({ start, end }: { start: HourMinute; end: HourMinute }): OpeningHour => {
  return {
    start,
    end,
    slotIntervalMinutes: slotInterval,
    slotDurationMinutes: slotDuration,
  };
};

const getIsoDate = (date: Date): IsoDate => {
  return date.toISOString().substr(0, 10);
};

const getOpeningHoursForDate = (
  resource: Resource,
  date: Date
): OpeningHour => {
  const overridenTime = resource.schedule.overriddenDates[getIsoDate(date)];
  if (overridenTime) {
    return overridenTime;
  }
  const dayOfWeek = date.getDay();
  if (dayOfWeek === 0) {
    return resource.schedule.sun;
  }
  if (dayOfWeek === 1) {
    return resource.schedule.mon;
  }
  if (dayOfWeek === 2) {
    return resource.schedule.tue;
  }
  if (dayOfWeek === 3) {
    return resource.schedule.wed;
  }
  if (dayOfWeek === 4) {
    return resource.schedule.thu;
  }
  if (dayOfWeek === 5) {
    return resource.schedule.fri;
  }
  if (dayOfWeek === 6) {
    return resource.schedule.sat;
  }
  throw new GenericBookingError(
    `Unable to find openinghours for resource ${resource.id}, date: ${date}, dayofWeek ${dayOfWeek}`
  );
};

const splitHourMinute = (
  hourMinute: HourMinute
): { hour: number; minute: number } => {
  try {
    const [hourStr, minuteStr] = hourMinute.split(':');
    const hour = parseInt(hourStr);
    const minute = parseInt(minuteStr);
    if (Number.isNaN(hour) || Number.isNaN(minute)) {
      throw new Error('HourMinute can not be parsed to integers');
    }
    return { hour, minute };
  } catch (error) {
    throw new GenericBookingError(
      `Received invalid opening hour ${hourMinute}.`
    );
  }
};

const splitHourMinuteOfDay = (date: Date): { hour: number; minute: number } => {
  return { hour: date.getUTCHours(), minute: date.getUTCMinutes() };
};

const firstSlotOfDay = (
  openingHours: OpeningHour,
  day: IsoDate
): Date | undefined => {
  if (isClosed(openingHours)) {
    return undefined;
  }
  return new Date(`${day}T${openingHours.start}:00Z`);
};

const isClosed = (openingHours: OpeningHour): boolean => {
  return openingHours.start === openingHours.end;
};

const isBeforeOpeningHours = (
  openingHours: OpeningHour,
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

const isAfterOpeningHours = (
  openingHours: OpeningHour,
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
  openingHours: OpeningHour,
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
  if (isClosed(openingHours)) {
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
  if (isAfterOpeningHours(openingHours, cleanedDate)) {
    const nextDay = startOfNextDay(date);
    if (nextDay > max) {
      return undefined;
    }
    return getNextTimeslotAfter(resource, nextDay, max);
  }
  return cleanedDate;
};

export const bookingSlotFitsInResourceSlots = (
  resource: Resource,
  booking: Booking
): boolean => {
  const bookingDurationMinutes =
    (booking.end.getTime() - booking.start.getTime()) / (60 * 1000);
  const openingHours = getOpeningHoursForDate(resource, booking.start);

  const { hour: startHour, minute: startMinute } = splitHourMinute(
    openingHours.start
  );
  const { hour: bookHour, minute: bookMinute } = splitHourMinuteOfDay(
    booking.start
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
        booking.start
      )} for resource ${resource.id}`,
      ErrorCode.INVALID_BOOKING_ARGUMENTS
    );
  }
  return true;
};

export const verifyIsBookable = (
  resource: Resource,
  existingBookings: Booking[],
  booking: Booking
) => {
  if (!resource.enabled) {
    throw new BadRequestError(
      `Unable to add booking to disabled resource ${resource.id}`,
      ErrorCode.RESOURCE_IS_DISABLED
    );
  }
  const overLappingBookings = existingBookings.filter(
    e =>
      e.resourceId === booking.resourceId &&
      e.canceled === false &&
      e.end > booking.start &&
      e.start < booking.end
  );
  if (overLappingBookings.length >= resource.seats) {
    throw new BadRequestError(
      `No available slots in requested period for resource ${resource.id}`,
      ErrorCode.BOOKING_SLOT_IS_NOT_AVAILABLE
    );
  }
  if (!isWithinOpeningHours(resource, booking.start)) {
    throw new BadRequestError(
      `Resource ${resource.id} is not open at requested time`,
      ErrorCode.BOOKING_SLOT_IS_NOT_AVAILABLE
    );
  }
  if (!bookingSlotFitsInResourceSlots(resource, booking)) {
    throw new BadRequestError(
      `Booked time ${booking.start.toISOString()} does not fit into resource ${
        resource.id
      } time slots`,
      ErrorCode.BOOKING_SLOT_IS_NOT_AVAILABLE
    );
  }
};
