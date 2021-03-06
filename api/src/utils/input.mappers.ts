import * as uuid from 'uuid';
import {
  DateSchedule,
  DateScheduleInput,
  HourSchedule,
  Maybe,
  Schedule,
} from '../graphql/generated/types';
import { closed } from './schedule.utils';
import { isISODay, validateDaySchedule } from './validation.utils';
import { isValidTimeZone } from './date.utils';

export function removeNull<T extends Record<string, unknown>>(
  args: Record<string, unknown>
): T {
  const whereInput: Record<string, unknown> = {};
  Object.entries(args).forEach(([k, v]) => {
    if (v !== null) {
      whereInput[k] = v;
    }
  });
  return whereInput as T;
}

export function getId(id: Maybe<string> | undefined = undefined): string {
  return id || uuid.v4();
}

function mapDaySchedule(daySchedule?: DateScheduleInput): HourSchedule {
  if (!daySchedule) {
    return closed;
  }
  return {
    start: daySchedule.start,
    end: daySchedule.end,
    slotIntervalMinutes: daySchedule.slotIntervalMinutes,
    slotDurationMinutes: daySchedule.slotDurationMinutes,
  };
}
function mapDateSchedule(daySchedule: DateScheduleInput): DateSchedule {
  return {
    isoDate: daySchedule.day,
    schedule: {
      start: daySchedule.start,
      end: daySchedule.end,
      slotIntervalMinutes: daySchedule.slotIntervalMinutes,
      slotDurationMinutes: daySchedule.slotDurationMinutes,
    },
  };
}

export function mapTimezone(timezone?: string): string {
  if (!timezone) {
    return 'Europe/Oslo';
  }

  if (isValidTimeZone(timezone)) {
    throw new Error(
      `Invalid timezone ${timezone}. See list of valid TZ database names at ` +
        `https://en.wikipedia.org/wiki/List_of_tz_database_time_zones`
    );
  }
  return timezone;
}

export function mapSchedule(scheduleList: DateScheduleInput[]): Schedule {
  scheduleList.forEach(validateDaySchedule);
  const weekdaysShort = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
  const overriddenDates = scheduleList
    .filter(s => !weekdaysShort.includes(s.day) && isISODay(s.day))
    .map(mapDateSchedule);
  return {
    mon: mapDaySchedule(scheduleList.find(s => s.day === 'mon')),
    tue: mapDaySchedule(scheduleList.find(s => s.day === 'tue')),
    wed: mapDaySchedule(scheduleList.find(s => s.day === 'wed')),
    thu: mapDaySchedule(scheduleList.find(s => s.day === 'thu')),
    fri: mapDaySchedule(scheduleList.find(s => s.day === 'fri')),
    sat: mapDaySchedule(scheduleList.find(s => s.day === 'sat')),
    sun: mapDaySchedule(scheduleList.find(s => s.day === 'sun')),
    overriddenDates,
  };
}
