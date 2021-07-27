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

export async function getFilteredBookings(
  args: FindBookingInput & { customerId: string }
): Promise<IQueryBuilder<DBBooking>> {
  // @ts-ignore
  let queryBuilder: IQueryBuilder<DBBooking> = db.booking.getRepository();

  let resources = db.resource
    .getRepository()
    .whereEqualTo('customerId', args.customerId);

  if (args.resourceIds?.length) {
    resources = resources.whereIn('id', args.resourceIds);
  }

  if (args.resourceCategories?.length) {
    resources = resources.whereIn('category', args.resourceCategories);
  }
  const matchingResources = await resources.find();
  if (!matchingResources.length) {
    return queryBuilder.whereEqualTo('id', '_'); // No result
  }
  queryBuilder = queryBuilder.whereIn(
    'resourceId',
    matchingResources.map(r => r.id)
  );

  if (args.customerId) {
    queryBuilder = queryBuilder.whereEqualTo('customerId', args.customerId);
  }
  if (args.userId) {
    queryBuilder = queryBuilder.whereEqualTo('userId', args.userId);
  }
  if (args.from) {
    queryBuilder = queryBuilder.whereGreaterOrEqualThan('start', args.from);
  }
  if (args.to) {
    queryBuilder = queryBuilder.whereLessThan('end', args.to);
  }
  if (args.includeCanceled !== true) {
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
  const bookings = await db.booking
    .getRepository()
    .whereEqualTo('resourceId', resourceId)
    .whereGreaterThan('end', from)
    .whereEqualTo('canceled', false)
    .find();
  return bookings.filter(b => b.start < to);
}
