import dayjs from 'dayjs';

export const formatToDateDisplay = (date: Date) => {
  return dayjs(date).format('DD. MMM').toLowerCase();
};

export const toDateValue = (date: Date): string => {
  return dayjs(date).format('YYYY-MM-DD');
};

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
  let time = dayjs().hour(fromTime.hour).minute(fromTime.minute);
  const endTime = dayjs().hour(toTime.hour).minute(toTime.minute);
  const timeOptions: Array<Option> = [];
  while (time < endTime) {
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
