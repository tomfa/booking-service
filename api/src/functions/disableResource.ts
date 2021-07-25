import { db } from '../db/client';
import {
  MutationDisableResourceArgs,
  Resource,
} from '../graphql/generated/types';
import { fromDBResource } from '../utils/db.mappers';
import { AuthToken } from '../auth/types';
import {
  ErrorCode,
  GenericBookingError,
  ObjectDoesNotExist,
} from '../utils/errors';

async function disableResource(
  { id }: MutationDisableResourceArgs,
  token: AuthToken
): Promise<Resource> {
  // TODO: What if id does not exist?

  try {
    const existing = await db.resource.findById(id);
    if (!existing) {
      throw new ObjectDoesNotExist(
        `Resource with id ${id} not found`,
        ErrorCode.RESOURCE_DOES_NOT_EXIST
      );
    }
    const resource = await db.resource.update({
      ...existing,
      enabled: false,
    });
    return fromDBResource(resource);
  } catch (err) {
    console.log(`Unhandled error: ${err}`);
    throw new GenericBookingError(
      `disableResource failed with unknown error`,
      err.code || ErrorCode.UNKNOWN_ERROR
    );
  }
}

export default disableResource;
