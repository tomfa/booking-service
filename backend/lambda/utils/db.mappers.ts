import {
  booking as DBBooking,
  customer as DBCustomer,
  Prisma,
  resource as DBResource,
} from '@prisma/client';
import {
  Booking,
  Customer,
  Resource,
  Schedule,
} from '../../graphql/generated/types';
import { closedSchedule } from './schedule';

export function fromDBBooking({
  startTime,
  endTime,
  ...booking
}: DBBooking): Booking {
  return { ...booking, start: startTime.getTime(), end: endTime.getTime() };
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
