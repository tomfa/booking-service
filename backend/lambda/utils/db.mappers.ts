import {
  booking as DBBooking,
  customer as DBCustomer,
  Prisma,
  resource as DBResource,
} from '@prisma/client';
import {
  Booking,
  Customer,
  FindBookingInput,
  Resource,
  Schedule,
} from '../../graphql/generated/types';
import { closedSchedule } from './schedule.utils';
import { fromGQLDate } from './date.utils';

export function fromDBBooking({
  startTime,
  endTime,
  ...booking
}: DBBooking): Booking {
  return {
    ...booking,
    start: Math.floor(startTime.getTime() / 1000),
    end: Math.floor(endTime.getTime() / 1000),
  };
}

export function fromDBCustomer(customer: DBCustomer): Customer {
  return { ...customer, credits: customer.credits || 999999 };
}

const mapFromDBSchedule = (val: Prisma.JsonValue): Schedule => {
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
  ...args
}: FindBookingInput): Prisma.bookingWhereInput {
  const startTimeFromFilter = from ? { gte: fromGQLDate(from) } : {};
  const startTimeToFilter = to ? { lt: fromGQLDate(to) } : {};
  // TODO: filter resourceIds by those accessable by customer
  return {
    resourceId: (resourceIds && { in: resourceIds }) || undefined,
    startTime: { ...startTimeFromFilter, ...startTimeToFilter },
    canceled: !includeCanceled ? false : undefined,
    ...args,
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
}): Prisma.bookingWhereInput {
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
