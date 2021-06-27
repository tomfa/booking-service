import { PrismaClient } from '@prisma/client';
import { Booking, Resource } from '../../graphql/generated/types';
import findBookings from '../functions/findBookings';
import { BadRequestError, ErrorCode } from './errors';

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
  const overLappingBookings = await findBookings(db, {
    resourceIds: [booking.resourceId],
    from: booking.start,
    to: booking.end,
    includeCanceled: false,
  });
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
