import {
  Booking,
  HourMinute,
  OpeningHour,
  Resource,
  TimeSlot,
} from './BookingAPI.types';
import { BadRequestError, ErrorCode } from './errors';

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

export const isSlotAvailable = (
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  resource: Resource,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  booking: Booking
): boolean => {
  // TODO
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
  if (!isSlotAvailable(resource, booking)) {
    throw new BadRequestError(
      `Slot from=${booking.start.toISOString()} to ${booking.end.toISOString()} is not available for resource ${
        resource.id
      }`,
      ErrorCode.BOOKING_SLOT_IS_NOT_AVAILABLE
    );
  }
};
