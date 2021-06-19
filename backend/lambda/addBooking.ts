import { AddBookingInput, Booking, Resource } from '../graphql/generated/types';
import { getDB } from './db';
import { getId } from './utils/input.mappers';
import { fromDBBooking } from './utils/db.mappers';
import { ErrorType } from './utils/types';
import getResourceById from './getResourceById';
import { BadRequestError, ErrorCode } from './utils/errors';

const isResource = (
  object: Resource | null | ErrorType
): object is Resource => {
  if (!object) {
    return false;
  }
  return !!(object as Resource).id;
};

const getEndTime = (start: Date, resource: Resource): Date => {
  const slotDuration = resource.schedule.mon.slotDurationMinutes;
  return new Date(start.getTime() + slotDuration * 60 * 1000);
};

async function addBooking({
  start,
  end,
  ...booking
}: AddBookingInput): Promise<Booking> {
  const db = await getDB();
  // TODO: what if id already exists
  const resource = await getResourceById(booking.resourceId);
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
