import { db } from '../db/client';

import {
  MutationUpdateResourceArgs,
  Resource,
  UpdateResourceInput,
} from '../graphql/generated/types';
import { mapSchedule, removeNull } from '../utils/input.mappers';
import { fromDBResource } from '../utils/db.mappers';
import {
  ErrorCode,
  GenericBookingError,
  ObjectDoesNotExist,
} from '../utils/errors';
import { Auth } from '../auth/types';
import { permissions, verifyPermission } from '../auth/permissions';

const mapResourceUpdate = (args: UpdateResourceInput) => {
  // TODO: Check how one can set null, and how we handle it.
  if (args.schedule) {
    return {
      ...removeNull(args),
      schedule: mapSchedule(args.schedule),
    };
  }
  return removeNull(args);
};

async function updateResource(
  { updateResourceInput: args }: MutationUpdateResourceArgs,
  token: Auth
): Promise<Resource | null> {
  verifyPermission(token, permissions.UPDATE_RESOURCE);

  // TODO: What if id does not exist?
  try {
    const existing = await db.resource.findById(args.id);
    if (!existing) {
      throw new ObjectDoesNotExist(
        `Resource with id ${args.id} not found`,
        ErrorCode.RESOURCE_DOES_NOT_EXIST
      );
    }
    if (existing.customerId !== token.customerId) {
      verifyPermission(token, permissions.ALL);
    }
    const resource = await db.resource.update({
      ...existing,
      ...mapResourceUpdate(args),
    });
    return fromDBResource(resource);
  } catch (err) {
    console.log(`Unhandled error: ${err}`);
    throw new GenericBookingError(
      `updateResource failed with unknown error`,
      err.code || ErrorCode.UNKNOWN_ERROR
    );
  }
}

export default updateResource;
