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
  const timeslots: TimeSlot[] = [];
  const immediatlyBeforeFrom = new Date(from.getTime() - 1);
  let cursor = getNextTimeslotStart(resource, immediatlyBeforeFrom);

  while (cursor && cursor < to) {
    const currentTimeSlot = getCurrentTimeSlot(resource, cursor);
    if (currentTimeSlot) {
      timeslots.push(currentTimeSlot);
    }
    cursor = getNextTimeslotStart(resource, cursor);
  }
  return timeslots;
};

export const getCurrentTimeSlot = (
  resource: Resource,
  time: Date
): TimeSlot | undefined => {
  if (!isOpen(resource, time)) {
    return undefined;
  }
  const schedule = getHoursForTimestamp(resource, time);
  return {
    availableSeats: resource.seats,
    start: time,
    end: new Date(time.getTime() + 1000 * 60 * schedule.slotDurationMinutes),
  };
};

export const getHoursForTimestamp = (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  resource: Resource,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  time: Date
): OpeningHour => {
  // TODO: This is no where near right
  return {
    start: '08:00',
    end: '16:00',
    slotDurationMinutes: 60,
    slotIntervalMinutes: 30,
  };
};

export const getNextSlotAfter = (resource: Resource, time: Date): Date => {
  return new Date(
    time.getTime() + resource.schedule.mon.slotIntervalMinutes * 60 * 1000
  );
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const isOpen = (resource: Resource, time: Date): boolean => {
  return true; // TODO
};

export const getNextTimeslotStart = (
  resource: Resource,
  cursor: Date
): Date | undefined => {
  // TODO: This is no where near right
  return new Date(
    cursor.getTime() + resource.schedule.mon.slotDurationMinutes * 60 * 1000
  );
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
    return resource.schedule.mon;
  }
  if (dayOfWeek === 1) {
    return resource.schedule.tue;
  }
  if (dayOfWeek === 3) {
    return resource.schedule.wed;
  }
  if (dayOfWeek === 3) {
    return resource.schedule.thu;
  }
  if (dayOfWeek === 4) {
    return resource.schedule.fri;
  }
  if (dayOfWeek === 5) {
    return resource.schedule.sat;
  }
  if (dayOfWeek === 6) {
    return resource.schedule.sun;
  }
  throw new GenericBookingError(
    `Unable to find openinghours for resource ${resource.id}, date: ${date}`
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

const isOutsideOpeningHours = (
  resource: Resource,
  booking: Booking
): boolean => {
  const openingHours = getOpeningHoursForDate(resource, booking.start);
  if (openingHours.start === openingHours.end) {
    return true;
  }
  const { hour: startHour, minute: startMinute } = splitHourMinute(
    openingHours.start
  );
  const { hour: endHour, minute: endMinute } = splitHourMinute(
    openingHours.end
  );
  const { hour: bookHour, minute: bookMinute } = splitHourMinuteOfDay(
    booking.start
  );
  // Note: Able to book _at_ opening hour
  if (bookHour * 60 + bookMinute < startHour * 60 + startMinute) {
    return true;
  }
  // Note: Not able to book _at_ closing hour
  if (bookHour * 60 + bookMinute >= endHour * 60 + endMinute) {
    return true;
  }
  return false;
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
      )} for resource ${resource.id}`
    );
  }
  return true;
};

export const verifyIsBookable = (
  resource: Resource,
  existingBookings: Booking[],
  booking: Booking
) => {
  // TODO: This needs to be tested for many edgecases
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
  if (isOutsideOpeningHours(resource, booking)) {
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
