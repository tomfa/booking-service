import {
  TimeSlot as GQLTimeSLot,
  Booking as GQLBooking,
  Schedule as GQLSchedule,
  Resource as GQLResource,
  DateScheduleInput,
  DateSchedule,
} from './graphql/generated/types';
import {
  Booking,
  HourSchedule,
  IsoDate,
  OpeningHour,
  Resource,
  Schedule,
  TimeSlot,
} from './types';
import { fromGQLDate } from './utils';

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

export const fromGQLBooking = (booking: GQLBooking): Booking => {
  const secondsDiff = booking.end - booking.start;
  const durationMinutes = Math.floor(secondsDiff / 60);
  return {
    ...booking,
    start: fromGQLDate(booking.start),
    end: fromGQLDate(booking.end),
    durationMinutes,
    userId: booking.userId || '',
    comment: booking.comment || '',
    seatNumbers: booking.seatNumbers,
  };
};

export const closedSchedule: HourSchedule = {
  start: '',
  end: '',
  slotIntervalMinutes: 0,
  slotDurationMinutes: 0,
};

function fromGQLDateSchedule(
  dateSchedule: DateSchedule
): [IsoDate, OpeningHour] {
  if (dateSchedule.schedule.start === '') {
    return [dateSchedule.isoDate, 'closed'];
  }
  return [
    dateSchedule.isoDate,
    {
      start: dateSchedule.schedule.start,
      end: dateSchedule.schedule.end,
      slotIntervalMinutes: dateSchedule.schedule.slotIntervalMinutes,
      slotDurationMinutes: dateSchedule.schedule.slotDurationMinutes,
    },
  ];
}

export function fromGQLResource(resource: GQLResource): Resource {
  return {
    ...resource,
    schedule: fromGQLSchedule(resource.schedule),
  };
}

export const isClosed = (schedule: HourSchedule): boolean => {
  return schedule.start === '';
};

export function fromGQLSchedule(scheduleList: GQLSchedule): Schedule {
  const overriddenDatesList = scheduleList.overriddenDates.map(
    fromGQLDateSchedule
  );

  return {
    mon: isClosed(scheduleList.mon) ? 'closed' : scheduleList.mon,
    tue: isClosed(scheduleList.tue) ? 'closed' : scheduleList.tue,
    wed: isClosed(scheduleList.wed) ? 'closed' : scheduleList.wed,
    thu: isClosed(scheduleList.thu) ? 'closed' : scheduleList.thu,
    fri: isClosed(scheduleList.fri) ? 'closed' : scheduleList.fri,
    sat: isClosed(scheduleList.sat) ? 'closed' : scheduleList.sat,
    sun: isClosed(scheduleList.sun) ? 'closed' : scheduleList.sun,
    overriddenDates: Object.fromEntries(overriddenDatesList),
  };
}

export const toGQLSchedule = (
  schedule?: Schedule
): DateScheduleInput[] | undefined => {
  if (!schedule) {
    return undefined;
  }
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
