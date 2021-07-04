import { IQueryBuilder } from 'fireorm';
import {
  Booking as GQLBooking,
  Customer,
  FindBookingInput,
  Resource,
  Schedule,
} from '../graphql/generated/types';
import { DBBooking, DBCustomer, DBResource } from '../db/types';
import { JSONObject } from '../types';
import { db } from '../db/client';
import { closedSchedule } from './schedule.utils';
import { toGQLDate } from './date.utils';

export function fromDBBooking({
  start,
  end,
  ...booking
}: DBBooking): GQLBooking {
  return {
    ...booking,
    start: toGQLDate(start),
    end: toGQLDate(end),
  };
}

export function fromDBCustomer(customer: DBCustomer): Customer {
  return { ...customer, credits: customer.credits };
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

export function getFilteredBookings(
  args: FindBookingInput
): IQueryBuilder<DBBooking> {
  const repository = db.booking.getRepository();

  // @ts-ignore
  let queryBuilder: IQueryBuilder<DBBooking> = repository;

  if (args.customerId) {
    queryBuilder = queryBuilder.whereEqualTo('customerId', args.customerId);
  }
  if (args.userId) {
    queryBuilder = queryBuilder.whereEqualTo('userId', args.userId);
  }
  if (args.resourceIds) {
    queryBuilder = queryBuilder.whereIn('resourceId', args.resourceIds);
  }
  if (args.resourceCategories) {
    // TODO: Implement
    // queryBuilder = queryBuilder.whereIn('resourceCategory', args.resourceCategories);
  }
  if (args.from) {
    queryBuilder = queryBuilder.whereGreaterOrEqualThan('start', args.from);
  }
  if (args.to) {
    queryBuilder = queryBuilder.whereLessThan('end', args.to);
  }
  if (args.includeCanceled !== false) {
    queryBuilder = queryBuilder.whereEqualTo('canceled', false);
  }
  return queryBuilder;
}

export async function getConflictingBookings({
  resourceId,
  from,
  to,
}: {
  resourceId: string;
  from: Date;
  to: Date;
}) {
  return await db.booking
    .getRepository()
    .whereEqualTo('resourceId', resourceId)
    .whereGreaterThan('end', from)
    .whereLessThan('start', to)
    .whereEqualTo('canceled', false)
    .find();
}
