import { db } from '../db/client';
import { MutationAddResourceArgs, Resource } from '../graphql/generated/types';
import { fromDBResource } from '../utils/db.mappers';
import { getId, mapSchedule, mapTimezone } from '../utils/input.mappers';
import {
  BadAuthenticationError,
  BadRequestError,
  ErrorCode,
} from '../utils/errors';
import { Auth } from '../auth/types';
import { permissions, verifyPermission } from '../auth/permissions';

async function addResource(
  { addResourceInput }: MutationAddResourceArgs,
  token: Auth
): Promise<Resource> {
  verifyPermission(token, permissions.ADD_RESOURCE);
  const {
    id,
    enabled = true,
    label = '',
    schedule,
    ...resource
  } = addResourceInput;
  if (resource.seats && resource.seats < 0) {
    throw new BadRequestError(
      `Can not create a resource with less than 0 seats`,
      ErrorCode.INVALID_RESOURCE_ARGUMENTS
    );
  }
  const customerId = resource.customerId || token.customerId;
  if (customerId !== token.customerId) {
    verifyPermission(token, permissions.ALL);
  }
  if (!customerId) {
    throw new BadAuthenticationError(
      `Can not create a resource without being authenticated as customer`,
      ErrorCode.BAD_AUTHENTICATION
    );
  }

  const mappedSchedule = mapSchedule(schedule);
  const timezone = mapTimezone(addResourceInput.timezone);

  const result = await db.resource.create({
    enabled,
    id: getId(id),
    label,
    schedule: mappedSchedule,
    ...resource,
    customerId,
    timezone,
  });
  return fromDBResource(result);
}

export default addResource;
