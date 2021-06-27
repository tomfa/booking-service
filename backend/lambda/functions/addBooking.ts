import { PrismaClient } from '@prisma/client';

import {
  AddBookingInput,
  Booking,
  Resource,
} from '../../graphql/generated/types';
import { getId } from '../utils/input.mappers';
import { fromDBBooking } from '../utils/db.mappers';
import {
  BadRequestError,
  ErrorCode,
  GenericBookingError,
} from '../utils/errors';
import { getOpeningHoursForDate } from '../utils/resource.utils';
import { fromGQLDate, toGQLDate } from '../utils/date.utils';
import { getAvailableSeatNumbers } from '../utils/seating.utils';
import { isOpen } from '../utils/schedule.utils';
import { AuthToken } from '../auth/types';
import getResourceById from './getResourceById';

const getEndTime = (start: Date, resource: Resource): Date => {
  const slotDuration = resource.schedule.mon.slotDurationMinutes;
  return new Date(start.getTime() + slotDuration * 60 * 1000);
};

async function addBooking(
  db: PrismaClient,
  { start, end, ...data }: AddBookingInput,
  token: AuthToken
): Promise<Booking> {
  // TODO: what if id already exists
  // TODO: Check that customer has credits
  // TODO: Reduce customer credits
  const resource = await getResourceById(db, data.resourceId, token);
  if (!resource) {
    throw new BadRequestError(
      `Can not create booking on unknown resource`,
      ErrorCode.RESOURCE_DOES_NOT_EXIST
    );
  }

  const openingHours = getOpeningHoursForDate(resource, fromGQLDate(start));
  if (!isOpen(openingHours)) {
    throw new BadRequestError(
      `Unable to add booking: resource ${resource.id} is closed`,
      ErrorCode.BOOKING_SLOT_IS_NOT_AVAILABLE
    );
  }

  const startTime = fromGQLDate(start);
  const endTime = (end && fromGQLDate(end)) || getEndTime(startTime, resource);
  const booking: Booking = {
    ...data,
    canceled: false,
    id: getId(data.id),
    start: toGQLDate(startTime),
    end: toGQLDate(endTime),
  };

  const seatNumbers = await getAvailableSeatNumbers(db, resource, booking);

  if (seatNumbers.length === 0) {
    throw new GenericBookingError(`Unable to find available seat number`);
  }
  const args = {
    id: booking.id,
    customerId: data.customerId || null,
    canceled: false,
    comment: data.comment || null,
    resourceId: data.resourceId,
    userId: data.userId || null,
    startTime,
    endTime,
    seatNumber: Math.min(...seatNumbers),
  };
  const dbBooking = await db.booking.create({
    data: args,
  });
  return fromDBBooking(dbBooking);
}

export default addBooking;
