import { fromGQLDate , fromGQLDate } from './utils';
import {
  TimeSlot as GQLTimeSLot,
  Booking as GQLBooking,
  DateScheduleInput,
} from './graphql/generated/types';
import { Booking, HourSchedule, Schedule, TimeSlot } from './types';

export const mapToTimeSlot = (slot: GQLTimeSLot): TimeSlot | undefined => {
  if (!slot) {
    return undefined;
  }
  return {
    start: fromGQLDate(slot.start),
    end: fromGQLDate(slot.end),
    availableSeats: slot.availableSeats,
  };
};

export const mapToBooking = (booking: GQLBooking): Booking => {
  const start = new Date(booking.start);
  const end = new Date(booking.end);
  const msDiff = booking.end - booking.start;
  const durationMinutes = Math.floor(msDiff / 60000);
  return {
    ...booking,
    start: fromGQLDate(booking.start),
    end: fromGQLDate(booking.end),
    durationMinutes,
    userId: booking.userId || '',
    comment: booking.comment || '',
    seatNumber: booking.seatNumber || -1,
  };
};

export const closedSchedule: HourSchedule = {
  start: '',
  end: '',
  slotIntervalMinutes: 0,
  slotDurationMinutes: 0,
};

export const mapSchedule = (schedule: Schedule): DateScheduleInput[] => {
  const weekSchedule = Object.entries(schedule)
    .filter(([k]) => k !== 'overriddenDates')
    .map(
      ([k, v]): DateScheduleInput => {
        if (v === 'closed') {
          return { day: k, ...closedSchedule };
        }
        return { ...(v as HourSchedule), day: k };
      }
    );
  const overrideSchedule = Object.entries(schedule.overriddenDates).map(
    ([k, v]): DateScheduleInput => {
      if (v === 'closed') {
        return { day: k, ...closedSchedule };
      }
      return { ...(v as HourSchedule), day: k };
    }
  );
  return [].concat(weekSchedule, overrideSchedule);
};
