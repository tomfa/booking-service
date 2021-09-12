import { db } from '../db/client';

import {
  AddBookingInput,
  Booking,
  MutationAddBookingArgs,
  Resource,
} from '../graphql/generated/types';
import { getId } from '../utils/input.mappers';
import { fromDBBooking, fromDBResource } from '../utils/db.mappers';
import {
  BadRequestError,
  ErrorCode,
  GenericBookingError,
} from '../utils/errors';
import { getOpeningHoursForDate } from '../utils/resource.utils';
import { fromGQLDate, toGQLDate } from '../utils/date.utils';
import { getAvailableSeatNumbers } from '../utils/seating.utils';
import {
  bookingSlotFitsInResourceSlots,
  isClosedAllDay,
} from '../utils/schedule.utils';
import { Auth } from '../auth/types';
import { minArray } from '../utils/array.utils';
import {
  hasPermission,
  permissions,
  verifyPermission,
} from '../auth/permissions';

const getEndTime = (start: Date, resource: Resource): Date => {
  const openingHours = getOpeningHoursForDate(resource, start);
  return new Date(
    start.getTime() + openingHours.slotDurationMinutes * 60 * 1000
  );
};

const getDesiredSeatNumbers = (
  input: AddBookingInput
): undefined | number[] => {
  if (input.seatNumber !== undefined) {
    if (input.seatNumbers?.length) {
      throw new GenericBookingError(
        `You cannot specify both a specific seatNumber and list of seatNumbers`
      );
    }
    return [input.seatNumber];
  }
  if (input.seatNumbers?.length) {
    return input.seatNumbers;
  }
  return undefined;
};

async function addBooking(
  { addBookingInput }: MutationAddBookingArgs,
  token: Auth
): Promise<Booking> {
  verifyPermission(token, permissions.ADD_OWN_BOOKING);
  const userId = addBookingInput.userId || token.sub;
  if (userId !== token.sub) {
    verifyPermission(token, permissions.ADD_ANY_BOOKING);
  }
  const { start, end, ...data } = addBookingInput;
  // TODO: Check that customer has credits
  // TODO: Reduce customer credits
  const dbResource = await db.resource.findById(data.resourceId);
  if (!dbResource) {
    throw new BadRequestError(
      `Can not create booking on unknown resource ${data.resourceId}`,
      ErrorCode.RESOURCE_DOES_NOT_EXIST
    );
  }
  if (
    dbResource.customerId !== token.customerId &&
    !hasPermission(token, permissions.ALL)
  ) {
    throw new BadRequestError(
      `Can not create booking on unknown resource ${data.resourceId}`,
      ErrorCode.RESOURCE_DOES_NOT_EXIST
    );
  }
  const resource = fromDBResource(dbResource);
  if (!resource.enabled) {
    throw new BadRequestError(
      `Unable to add booking to disabled resource ${resource.id}`,
      ErrorCode.RESOURCE_IS_DISABLED
    );
  }

  const openingHours = getOpeningHoursForDate(resource, fromGQLDate(start));
  if (isClosedAllDay(openingHours)) {
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
    seatNumbers: [], // Irrelevant, will be overridden
  };

  if (!bookingSlotFitsInResourceSlots(resource, booking)) {
    throw new BadRequestError(
      `Booked time ${startTime.toISOString()} does not fit into resource ${
        resource.id
      } time slots`,
      ErrorCode.BOOKING_SLOT_IS_NOT_AVAILABLE
    );
  }

  const availableSeatNumbers = await getAvailableSeatNumbers(
    db,
    resource,
    booking
  );
  if (availableSeatNumbers.length === 0) {
    throw new GenericBookingError(`Unable to find available seat number`);
  }
  const seatNumbersToBook: undefined | number[] = getDesiredSeatNumbers(
    addBookingInput
  );
  if (
    seatNumbersToBook &&
    seatNumbersToBook.find(seat => !availableSeatNumbers.includes(seat))
  ) {
    const unavailableSeat = seatNumbersToBook.find(
      seat => !availableSeatNumbers.includes(seat)
    );
    throw new GenericBookingError(
      `Seat number ${unavailableSeat} is not available`
    );
  }
  const seatNumbers = seatNumbersToBook || [minArray(availableSeatNumbers)];

  const args = {
    id: booking.id,
    customerId: dbResource.customerId,
    canceled: false,
    comment: data.comment || null,
    resourceId: data.resourceId,
    userId: data.userId || null,
    start: startTime,
    end: endTime,
    seatNumbers,
  };
  const dbBooking = await db.booking.create(args);
  return fromDBBooking(dbBooking);
}

export default addBooking;
