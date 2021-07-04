import {
  Booking,
  Customer,
  FindBookingInput,
  Resource,
  Schedule,
} from '../graphql/generated/types';
import { DBBooking, DBCustomer, DBResource } from '../db/types';
import { JSONObject } from '../types';
import { closedSchedule } from './schedule.utils';
import { fromGQLDate, toGQLDate } from './date.utils';

export function fromDBBooking({
  startTime,
  endTime,
  ...booking
}: DBBooking): Booking {
  return {
    ...booking,
    start: toGQLDate(startTime),
    end: toGQLDate(endTime),
  };
}

export function fromDBCustomer(customer: DBCustomer): Customer {
  return { ...customer, credits: customer.credits || 999999 };
}

const mapFromDBSchedule = (val: JSONObject): Schedule => {
  if (!val) {
    return closedSchedule;
  }
  return val as Schedule;
};

export function fromDBResource(dbResult: DBResource): Resource {
  return { ...dbResult, schedule: mapFromDBSchedule(dbResult.schedule) };
}

export function toBookingFilter({
  resourceIds,
  from,
  to,
  includeCanceled,
  resourceCategories,
  ...args
}: FindBookingInput) {
  const startTimeFromFilter = from ? { gte: fromGQLDate(from) } : {};
  const startTimeToFilter = to ? { lt: fromGQLDate(to) } : {};
  // TODO: filter resourceIds by those accessable by customer
  const bookingWhereFilter = {
    resourceId: (resourceIds && { in: resourceIds }) || undefined,
    startTime: { ...startTimeFromFilter, ...startTimeToFilter },
    canceled: !includeCanceled ? false : undefined,
    ...args,
  };
  if (!resourceCategories) {
    return bookingWhereFilter;
  }
  return {
    ...bookingWhereFilter,
    resource: { category: { in: resourceCategories } },
  };
}

export function conflictingBookingFilter({
  resourceId,
  from,
  to,
}: {
  resourceId: string;
  from: Date;
  to: Date;
}) {
  const endTimeFilter = { gt: from };
  const startTimeFilter = { lt: to };
  // TODO: filter resourceIds by those accessable by customer
  return {
    resourceId,
    startTime: startTimeFilter,
    endTime: endTimeFilter,
    canceled: false,
  };
}
