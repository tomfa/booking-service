import { DateScheduleInput } from '../../graphql/generated/types';
import { BadRequestError, ErrorCode } from './errors';
import { splitHourMinute } from './sdk.utils';

export const validateHourMinute = (hourMinute: string) => {
  if (!hourMinute.includes(':')) {
    throw new BadRequestError(
      `hourMinute '${hourMinute}' must include ":"`,
      ErrorCode.INVALID_TIMESTAMP
    );
  }
  const [hourStr, minuteStr] = hourMinute.split(':');
  const hour = parseInt(hourStr);
  const minute = parseInt(minuteStr);
  if (Number.isNaN(hour) || Number.isNaN(minute)) {
    throw new BadRequestError(
      `hourMinute '${hourMinute}': can not be parsed to integers`,
      ErrorCode.INVALID_TIMESTAMP
    );
  }
  if (hour > 23 || hour < 0) {
    throw new BadRequestError(
      `hourMinute '${hourMinute}': hours must be >= 0 and < 24`,
      ErrorCode.INVALID_TIMESTAMP
    );
  }
  if (minute > 59 || minute < 0) {
    throw new BadRequestError(
      `hourMinute '${hourMinute}': minute must be >= 0 and < 60`,
      ErrorCode.INVALID_TIMESTAMP
    );
  }
};

export const isISODay = (dateString: string): boolean => {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    return false;
  }
  if (dateString !== date.toISOString().substr(0, 10)) {
    return false;
  }
  return true;
};

const validateDayScheduleDay = (isoDay: string) => {
  const weekdaysShort = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
  if (!weekdaysShort.includes(isoDay) && !isISODay(isoDay)) {
    throw new BadRequestError(
      `Date '${isoDay}' is not a three letter weekend or in the format YYYY-MM-DD`,
      ErrorCode.INVALID_RESOURCE_ARGUMENTS
    );
  }
};

const isClosed = (date: DateScheduleInput): boolean => {
  return date.start === '' && date.end === '';
};

const validateStartAndEndTimestamp = ({
  start,
  end,
  day,
}: DateScheduleInput) => {
  if (start === '' || end === '') {
    throw new BadRequestError(
      `Schedule for ${day}: start and end must eithr both or none be blank`,
      ErrorCode.INVALID_TIMESTAMP
    );
  }
  const { hour: startHour, minute: startMinute } = splitHourMinute(start);
  const { hour: endHour, minute: endMinute } = splitHourMinute(end);
  if (startHour * 60 + startMinute > endHour * 60 + endMinute) {
    throw new BadRequestError(
      `Start time '${start}' is after end time '${end}'`,
      ErrorCode.INVALID_TIMESTAMP
    );
  }
  if (start !== '') {
    validateHourMinute(start);
    validateHourMinute(end);
  }
};

export const validateDaySchedule = (schedule: DateScheduleInput) => {
  const { day, slotDurationMinutes, slotIntervalMinutes } = schedule;
  validateDayScheduleDay(day);
  if (!isClosed(schedule)) {
    validateStartAndEndTimestamp(schedule);
    if (slotDurationMinutes <= 0) {
      throw new BadRequestError(
        `Schedule for ${day}: slotDurationMinutes must be bigger than 0`,
        ErrorCode.INVALID_RESOURCE_ARGUMENTS
      );
    }
    if (slotIntervalMinutes <= 0) {
      throw new BadRequestError(
        `Schedule for ${day}: slotIntervalMinutes must be bigger than 0`,
        ErrorCode.INVALID_RESOURCE_ARGUMENTS
      );
    }
  }
};
