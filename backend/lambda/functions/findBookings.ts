import { PrismaClient } from '@prisma/client/scripts/default-index';
import { Booking, FindBookingInput } from '../../graphql/generated/types';
import { fromDBBooking } from '../utils/db.mappers';
import { fromGQLDate } from '../utils/date.utils';

async function findBookings(
  db: PrismaClient,
  { resourceIds, from, to, includeCanceled, ...args }: FindBookingInput
): Promise<Booking[]> {
  const startTimeFromFilter = from ? { gte: fromGQLDate(from) } : {};
  const startTimeToFilter = to ? { lt: fromGQLDate(to) } : {};
  // TODO: filter resourceIds by those accessable by customer
  const where = {
    resourceId: (resourceIds && { in: resourceIds }) || undefined,
    startTime: { ...startTimeFromFilter, ...startTimeToFilter },
    canceled: !includeCanceled ? false : undefined,
    ...args,
  };
  const bookings = await db.booking.findMany({
    where,
    include: { resource: true },
  });
  return bookings.map(fromDBBooking);
}

export default findBookings;
