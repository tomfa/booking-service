import { PrismaClient } from '../db/client';
import { Booking, Resource } from '../graphql/generated/types';
import { BadRequestError, ErrorCode } from './errors';
import { getConflictingBookings } from './db.mappers';
import { fromGQLDate } from './date.utils';

const generateSeatNumbersForResource = (resource: Resource): number[] => {
  return Array(resource.seats)
    .fill('')
    .map((x, i) => i);
};
export const getAvailableSeatNumbers = async (
  db: PrismaClient,
  resource: Resource,
  booking: Booking
): Promise<number[]> => {
  const overLappingBookings = await getConflictingBookings({
    resourceId: booking.resourceId,
    from: fromGQLDate(booking.start),
    to: fromGQLDate(booking.end),
  });
  if (overLappingBookings.length >= resource.seats) {
    throw new BadRequestError(
      `No available slots in requested period for resource ${resource.id}`,
      ErrorCode.BOOKING_SLOT_IS_NOT_AVAILABLE
    );
  }
  const reservedSeatNumbers = overLappingBookings
    .map(b => b.seatNumbers)
    .reduce((all, bookingSeats) => all.concat(bookingSeats), []);
  const allSeatNumbers = generateSeatNumbersForResource(resource);
  return allSeatNumbers.filter(num => !reservedSeatNumbers.includes(num));
};
