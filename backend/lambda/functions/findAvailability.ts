import { PrismaClient } from '@prisma/client';
import {
  Booking,
  FindAvailabilityInput,
  Resource,
  TimeSlot,
} from '../../graphql/generated/types';
import {
  BadRequestError,
  ErrorCode,
  ObjectDoesNotExist,
} from '../utils/errors';
import { fromGQLDate } from '../utils/date.utils';
import { constructAllSlots, reduceAvailability } from '../utils/sdk.utils';
import { fromDBBooking, fromDBResource } from '../utils/db.mappers';

const findAvailabilityForSingleResource = (
  resource: Resource,
  from: Date,
  to: Date,
  bookings: Booking[]
): TimeSlot[] => {
  const availabileResourceTimeSlots = constructAllSlots({
    resource,
    from,
    to,
  });

  const slotsWithCorrectAvailability: TimeSlot[] = reduceAvailability(
    availabileResourceTimeSlots,
    bookings
  );
  return slotsWithCorrectAvailability;
};

async function findAvailability(
  db: PrismaClient,
  args: FindAvailabilityInput
): Promise<TimeSlot[]> {
  if (args.resourceIds.length === 0) {
    return [];
  }
  const resources = await db.resource.findMany({
    where: {
      id: { in: args.resourceIds },
      enabled: true,
      customerId: args.customerId || undefined,
    },
  });
  const foundResourceIds = resources.map(r => r.id);
  const missingResources = args.resourceIds.filter(
    id => !foundResourceIds.includes(id)
  );
  if (missingResources.length) {
    const missingIdStrings = missingResources.join(',');
    throw new ObjectDoesNotExist(
      `Unable to find enabled resources with ids: ${missingIdStrings}`,
      ErrorCode.RESOURCE_DOES_NOT_EXIST
    );
  }
  const from = (args.from && fromGQLDate(args.from)) || new Date();
  const to =
    (args.to && fromGQLDate(args.to)) ||
    new Date(from.getTime() + 31 * 24 * 3600 * 1000);

  const bookingFilter = {
    resourceId: { in: args.resourceIds },
    startTime: { gt: from },
    endTime: { lt: to },
    canceled: false,
  };
  const bookings = await db.booking.findMany({ where: bookingFilter });

  // TODO: Support multiple resources
  if (resources.length > 1) {
    throw new BadRequestError(
      `findAvailability is not yet supported with multiple resources.`,
      ErrorCode.UNKNOWN_ERROR
    );
  }

  return findAvailabilityForSingleResource(
    fromDBResource(resources[0]),
    from,
    to,
    bookings.map(fromDBBooking)
  );
}

export default findAvailability;
