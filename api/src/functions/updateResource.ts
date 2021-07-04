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
import { AuthToken } from '../auth/types';

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
  token: AuthToken
): Promise<Resource | null> {
  // TODO: What if id does not exist?
  try {
    const resource = await db.resource.update({
      where: { id: args.id },
      data: mapResourceUpdate(args),
    });
    return fromDBResource(resource);
  } catch (err) {
    if (err.code === 'P2025') {
      throw new ObjectDoesNotExist(
        `Resource with id ${args.id} not found`,
        ErrorCode.RESOURCE_DOES_NOT_EXIST
      );
    }
    console.log(`Unhandled error: ${err}`);
    throw new GenericBookingError(
      `updateResource failed with unknown error`,
      err.code || ErrorCode.UNKNOWN_ERROR
    );
  }
}

export default updateResource;
