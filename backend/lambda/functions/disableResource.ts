import { PrismaClient } from '@prisma/client';
import { Resource } from '../../graphql/generated/types';
import { fromDBResource } from '../utils/db.mappers';
import { AuthToken } from '../auth/types';
import {
  ErrorCode,
  GenericBookingError,
  ObjectDoesNotExist,
} from '../utils/errors';

async function disableResource(
  db: PrismaClient,
  id: string,
  token: AuthToken
): Promise<Resource> {
  // TODO: What if id does not exist?

  try {
    const resource = await db.resource.update({
      where: { id },
      data: { enabled: false },
    });
    return fromDBResource(resource);
  } catch (err) {
    if (err.code === 'P2025') {
      throw new ObjectDoesNotExist(
        `Resource with id ${id} not found`,
        ErrorCode.RESOURCE_DOES_NOT_EXIST
      );
    }
    console.log(`Unhandled error: ${err}`);
    throw new GenericBookingError(
      `disableResource failed with unknown error`,
      err.code || ErrorCode.UNKNOWN_ERROR
    );
  }
}

export default disableResource;
