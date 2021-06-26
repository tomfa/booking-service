import { PrismaClient } from '@prisma/client';
import { Booking, Resource } from '../../graphql/generated/types';
import findBookings from '../functions/findBookings';
import { BadRequestError, ErrorCode } from './errors';
import { fromGQLDate } from './date.utils';
import {
  bookingSlotFitsInResourceSlots,
  isWithinOpeningHours,
} from './schedule.utils';

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
  if (!resource.enabled) {
    throw new BadRequestError(
      `Unable to add booking to disabled resource ${resource.id}`,
      ErrorCode.RESOURCE_IS_DISABLED
    );
  }
  if (!isWithinOpeningHours(resource, fromGQLDate(booking.start))) {
    throw new BadRequestError(
      `Resource ${resource.id} is not open at requested time`,
      ErrorCode.BOOKING_SLOT_IS_NOT_AVAILABLE
    );
  }
  if (!bookingSlotFitsInResourceSlots(resource, booking)) {
    throw new BadRequestError(
      `Booked time ${booking.start} does not fit into resource ${resource.id} time slots`,
      ErrorCode.BOOKING_SLOT_IS_NOT_AVAILABLE
    );
  }
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
