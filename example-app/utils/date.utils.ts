import dayjs from 'dayjs';

import { Option } from '../components/DateTimePicker/types';
import 'dayjs/locale/nb';
import { upperCaseFirstLetter } from './string.utils';

dayjs.locale('nb');

export enum Weekday {
  SUNDAY = 'sun',
  MONDAY = 'mon',
  TUESDAY = 'tue',
  WEDNESDAY = 'wed',
  THURSDAY = 'thu',
  FRIDAY = 'fri',
  SATURDAY = 'sat',
}

export const getWeekDayString = (day: Weekday): string => {
  if (day === Weekday.SUNDAY) {
    return `Søndag`;
  }
  if (day === Weekday.MONDAY) {
    return `Mandag`;
  }
  if (day === Weekday.TUESDAY) {
    return `Tirsdag`;
  }
  if (day === Weekday.WEDNESDAY) {
    return `Onsdag`;
  }
  if (day === Weekday.THURSDAY) {
    return `Torsdag`;
  }
  if (day === Weekday.FRIDAY) {
    return `Fredag`;
  }
  if (day === Weekday.SATURDAY) {
    return `Lørdag`;
  }
  throw new Error(`Unsupported day of week: ${day}`);
};

export interface TimeStamp {
  hour: number;
  minute: number;
}

interface getTimeOptionProps {
  fromTime: TimeStamp;
  toTime: TimeStamp;
  intervalMinutes: number;
}
export const fromGQLDate = (seconds: number): Date => new Date(seconds * 1000);
export const toGQLDate = (date: Date): number =>
  Math.floor(date.getTime() / 1000);
export const getTimeOption = ({
  fromTime,
  toTime,
  intervalMinutes,
}: getTimeOptionProps): Array<Option> => {
  let time = dayjs()
    .hour(fromTime.hour)
    .minute(fromTime.minute)
    .second(0)
    .millisecond(0);
  let endTime = dayjs()
    .hour(toTime.hour)
    .minute(toTime.minute)
    .second(0)
    .millisecond(0);
  const isEndTimeBeforeStartTime = endTime < time;
  if (isEndTimeBeforeStartTime) {
    endTime = endTime.add(1, 'days');
  }
  const timeOptions: Array<Option> = [];
  while (time <= endTime) {
    timeOptions.push({
      value: time.hour() * 60 + time.minute(),
      label: time.format('HH:mm'),
    });
    time = time.add(intervalMinutes, 'minute');
  }
  return timeOptions;
};

interface getDateOptionProps {
  startDate: Date;
  endDate: Date;
  dateFormat?: string;
  excludeDays?: Array<Weekday>;
}
const DATE_FORMAT = 'dddd D. MMM';

export const displayDate = (date: Date) => dayjs(date).format(DATE_FORMAT);
export const getDateOptions = ({
  startDate,
  endDate,
  excludeDays = [],
  dateFormat = DATE_FORMAT,
}: getDateOptionProps): Array<Option> => {
  let day = dayjs(startDate).startOf('day');
  const stopDay = dayjs(endDate).startOf('day');
  const dates: Array<Option> = [];

  while (day < stopDay) {
    const skipDay =
      excludeDays.length && excludeDays.includes(getDayOfWeek(day));
    if (!skipDay) {
      dates.push({
        value: day.toISOString(),
        label: upperCaseFirstLetter(day.format(dateFormat)),
      });
    }
    day = day.add(1, 'day');
  }

  return dates;
};

const WEEKDAK_LOOKUP: { [index: string]: Weekday } = {
  '0': Weekday.SUNDAY,
  '1': Weekday.MONDAY,
  '2': Weekday.TUESDAY,
  '3': Weekday.WEDNESDAY,
  '4': Weekday.THURSDAY,
  '5': Weekday.FRIDAY,
  '6': Weekday.SATURDAY,
};
export const getDayOfWeek = (
  date: string | number | dayjs.Dayjs | Date
): Weekday => {
  return WEEKDAK_LOOKUP[toDayJs(date).format('d')];
};

const toDayJs = (date: string | number | dayjs.Dayjs | Date): dayjs.Dayjs => {
  if (dayjs.isDayjs(date)) {
    return date;
  }
  return dayjs(date);
};

export const plusTime = (
  date: Date,
  value: number,
  unit: 'day' | 'hour' | 'minute' | 'year'
) => toDayJs(date).add(value, unit).toDate();

export const asStringValue = (date: Date): string =>
  toDayJs(date).toISOString();

export const asOption = (date: Date, format = DATE_FORMAT): Option => ({
  value: asStringValue(date),
  label: upperCaseFirstLetter(toDayJs(date).format(format)),
});

export const displayTime = (date: Date): string => {
  const hour = dayjs(date).hour();
  const minute = dayjs(date).minute();
  return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
};

export const timeStampAsOption = ({ hour, minute }: TimeStamp): Option => {
  const hourString = String(hour).padStart(2, '0');
  const minuteString = String(minute).padStart(2, '0');
  return {
    value: hour * 60 + minute,
    label: `${hourString}:${minuteString}`,
  };
};

export const toTimeStamp = (dayMinutes: number | string): TimeStamp => {
  if (typeof dayMinutes === 'string') {
    dayMinutes = Number.parseInt(dayMinutes);
  }
  const minute = dayMinutes % 60;
  const hour = (dayMinutes - minute) / 60;
  return {
    hour,
    minute,
  };
};

export const addMinutes = (time: TimeStamp, minutes: number): TimeStamp => {
  let hoursToAdd = Math.floor(minutes / 60);
  let minutesToAdd = minutes % 60;
  if (minutesToAdd + time.minute >= 60) {
    hoursToAdd += 1;
    minutesToAdd -= 60;
  }

  return {
    hour: (time.hour + hoursToAdd) % 24,
    minute: time.minute + minutesToAdd,
  };
};

export const subtractMinutes = (
  time: TimeStamp,
  minutes: number
): TimeStamp => {
  let hours = Math.floor(minutes / 60);
  let minutesToSubtract = minutes % 60;
  if (time.minute - minutesToSubtract < 0) {
    hours -= 1;
    minutesToSubtract -= 60;
  }

  return {
    hour: (time.hour - hours) % 24,
    minute: time.minute - minutesToSubtract,
  };
};
