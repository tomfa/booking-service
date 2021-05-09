import {
  Resource,
  Booking,
  TimeSlot,
  HourMinute,
  OpeningHour,
} from './BookingAPI.types';

export const constructAllSlots = ({
  resource,
  from,
  to,
}: {
  resource: Resource;
  from: Date;
  to: Date;
}): TimeSlot[] => {
  let timeslots: TimeSlot[] = [];
  const immediatlyBeforeFrom = new Date(from.getTime() - 1);
  let cursor = getNextTimeslotStart(resource, immediatlyBeforeFrom);

  while (cursor && cursor < to) {
    const currentTimeSlot = getCurrentTimeSlot(resource, cursor);
    if (currentTimeSlot) {
      timeslots.push(currentTimeSlot)
    }
    cursor = getNextTimeslotStart(resource, cursor);
  }
  return timeslots;
};

export const getCurrentTimeSlot = (resource: Resource, time: Date): TimeSlot | undefined => {
  if (!isOpen(resource, time)) {
    return undefined
  }
  const schedule = getHoursForTimestamp(resource, time)
  return {
    availableSeats: resource.seats,
    start: time,
    end: new Date(time.getTime() + 1000 * 60 * schedule.slotDurationMinutes),
  }
}

export const getHoursForTimestamp = (resource: Resource, time: Date): OpeningHour => {
  // TODO: This is no where near right
  return {
    start: '08:00',
    end: '16:00',
    slotDurationMinutes: 60,
    slotIntervalMinutes: 30,
  }
}

export const getNextSlotAfter = (resource: Resource, time: Date): Date => {
  return new Date(
    time.getTime() + resource.schedule.mon.slotIntervalMinutes * 60 * 1000,
  );
};

export const isOpen = (resource: Resource, time: Date): boolean => {
  return true; // TODO
};

export const getNextTimeslotStart = (resource: Resource, cursor: Date): Date | undefined => {
  // TODO: This is no where near right
  return new Date(
    cursor.getTime() + resource.schedule.mon.slotDurationMinutes * 60 * 1000,
  );
};

export const reduceAvailability = (
  tempSlots: TimeSlot[],
  bookings: Booking[],
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
