import { PrismaClient } from '@prisma/client/scripts/default-index';
import {
  AddBookingInput,
  Booking,
  Resource,
} from '../../graphql/generated/types';
import { getId } from '../utils/input.mappers';
import { fromDBBooking } from '../utils/db.mappers';
import { BadRequestError, ErrorCode } from '../utils/errors';
import getResourceById from './getResourceById';

const getEndTime = (start: Date, resource: Resource): Date => {
  const slotDuration = resource.schedule.mon.slotDurationMinutes;
  return new Date(start.getTime() + slotDuration * 60 * 1000);
};

async function addBooking(
  db: PrismaClient,
  { start, end, ...booking }: AddBookingInput
): Promise<Booking> {
  // TODO: what if id already exists
  const resource = await getResourceById(db, booking.resourceId);
  if (!resource) {
    throw new BadRequestError(
      `Can not create booking on unknown resource`,
      ErrorCode.RESOURCE_DOES_NOT_EXIST
    );
  }

  const startTime = new Date(start);
  const endTime = (end && new Date(end)) || getEndTime(startTime, resource);
  const dbBooking = await db.booking.create({
    data: {
      ...booking,
      canceled: false,
      id: getId(booking.id),
      startTime,
      endTime,
    },
  });
  return fromDBBooking(dbBooking);
}

export default addBooking;
