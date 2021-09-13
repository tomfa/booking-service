import { db } from '../db/client';
import {
  Booking,
  QueryFindAvailabilityArgs,
  Resource,
  TimeSlot,
} from '../graphql/generated/types';
import {
  BadRequestError,
  ErrorCode,
  ObjectDoesNotExist,
} from '../utils/errors';
import { fromGQLDate, reduceAvailability } from '../utils/date.utils';
import {
  getConflictingBookings,
  fromDBBooking,
  fromDBResource,
} from '../utils/db.mappers';
import { constructAllSlots } from '../utils/schedule.utils';
import { Auth } from '../auth/types';
import { permissions, verifyPermission } from '../auth/permissions';

export const findAvailabilityForSingleResource = (
  resource: Resource,
  from: Date,
  to: Date,
  bookings: Booking[]
): TimeSlot[] => {
  const availableResourceTimeSlots = constructAllSlots({
    resource,
    from,
    to,
  });

  const slotsWithCorrectAvailability: TimeSlot[] = reduceAvailability(
    availableResourceTimeSlots,
    bookings
  );
  return slotsWithCorrectAvailability;
};

async function findAvailability(
  { filterAvailability: args }: QueryFindAvailabilityArgs,
  token: Auth
): Promise<TimeSlot[]> {
  verifyPermission(token, permissions.FIND_RESOURCE_AVAILABILITY);
  const customerId = args.customerId || token.customerId;
  if (customerId !== token.customerId) {
    verifyPermission(token, permissions.ALL);
  }
  if (args.resourceIds.length === 0) {
    return [];
  }
  const resources = await db.resource
    .getRepository()
    .whereIn('id', args.resourceIds)
    .whereEqualTo('enabled', true)
    .whereEqualTo('customerId', customerId)
    .find();

  const foundResourceIds = resources.map(r => r.id);
  const missingResources = args.resourceIds.filter(
    id => !foundResourceIds.includes(id)
  );
  if (missingResources.length) {
    const missingIdStrings = missingResources.join(',');
    throw new ObjectDoesNotExist(
      `Unable to find enabled resources with ids: ${missingIdStrings} for customer ${customerId}`,
      ErrorCode.RESOURCE_DOES_NOT_EXIST
    );
  }
  const from = (args.from && fromGQLDate(args.from)) || new Date();
  const to =
    (args.to && fromGQLDate(args.to)) ||
    new Date(from.getTime() + 7 * 24 * 3600 * 1000);

  // TODO: Support multiple resources
  if (resources.length > 1) {
    throw new BadRequestError(
      `findAvailability is not yet supported with multiple resources`,
      ErrorCode.UNKNOWN_ERROR
    );
  }

  // TODO: Improve performance
  const numDays = Math.floor(
    to.getTime() - from.getTime() / (24 * 3600 * 1000)
  );
  const maxDaysAllowed = 32;
  if (numDays > maxDaysAllowed) {
    throw new BadRequestError(
      `findAvailability can not yet be used for periods longer than ${maxDaysAllowed} days`,
      ErrorCode.UNKNOWN_ERROR
    );
  }

  const bookings = await getConflictingBookings({
    resourceId: resources[0].id,
    from,
    to,
  });

  return findAvailabilityForSingleResource(
    fromDBResource(resources[0]),
    from,
    to,
    bookings.map(fromDBBooking)
  );
}

export default findAvailability;
