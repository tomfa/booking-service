import { PrismaClient } from '@prisma/client';
import { Booking, Resource } from '../../graphql/generated/types';
import { BadRequestError, ErrorCode } from './errors';
import { conflictingBookingFilter, fromDBBooking } from './db.mappers';
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
  const dbBookings = await db.booking.findMany({
    where: conflictingBookingFilter({
      resourceId: booking.resourceId,
      from: fromGQLDate(booking.start),
      to: fromGQLDate(booking.end),
    }),
  });
  const overLappingBookings = dbBookings.map(fromDBBooking);
  if (overLappingBookings.length >= resource.seats) {
    throw new BadRequestError(
      `No available slots in requested period for resource ${resource.id}`,
      ErrorCode.BOOKING_SLOT_IS_NOT_AVAILABLE
    );
  }
  const reservedSeatNumbers = overLappingBookings.map(b => b.seatNumber);
  const allSeatNumbers = generateSeatNumbersForResource(resource);
  return allSeatNumbers.filter(num => !reservedSeatNumbers.includes(num));
};
