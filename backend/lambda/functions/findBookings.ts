import { PrismaClient } from '@prisma/client/scripts/default-index';
import { Booking, FindBookingInput } from '../../graphql/generated/types';
import { fromDBBooking } from '../utils/db.mappers';
import { fromGQLDate } from '../utils/date.utils';

async function findBookings(
  db: PrismaClient,
  { resourceIds, from, to, includeCanceled, ...args }: FindBookingInput
): Promise<Booking[]> {
  const where = {
    resourceId: (resourceIds && { in: resourceIds }) || undefined,
    startTime: from ? { gte: fromGQLDate(from) } : undefined,
    endTime: to ? { lte: fromGQLDate(to) } : undefined,
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
