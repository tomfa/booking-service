import { HourSchedule, Resource } from '../graphql/generated/types';
import { GenericBookingError } from './errors';
import { getIsoDate } from './date.utils';

export const getOpeningHoursForDate = (
  resource: Resource,
  date: Date
): HourSchedule => {
  const isoDate = getIsoDate(date);
  const overridenTime = resource.schedule.overriddenDates?.find(
    r => r?.isoDate === isoDate
  );
  if (overridenTime) {
    return overridenTime.schedule;
  }
  const dayOfWeek = date.getUTCDay();
  if (dayOfWeek === 0) {
    return resource.schedule.sun;
  }
  if (dayOfWeek === 1) {
    return resource.schedule.mon;
  }
  if (dayOfWeek === 2) {
    return resource.schedule.tue;
  }
  if (dayOfWeek === 3) {
    return resource.schedule.wed;
  }
  if (dayOfWeek === 4) {
    return resource.schedule.thu;
  }
  if (dayOfWeek === 5) {
    return resource.schedule.fri;
  }
  if (dayOfWeek === 6) {
    return resource.schedule.sat;
  }
  throw new GenericBookingError(
    `Unable to find openinghours for resource ${resource.id}, date: ${date}, dayofWeek ${dayOfWeek}`
  );
};
