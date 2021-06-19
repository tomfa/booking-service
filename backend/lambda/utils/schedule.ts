import { HourSchedule, Schedule } from '../../graphql/generated/types';

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
