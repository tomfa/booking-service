import { PrismaClient } from '@prisma/client';
import { AddResourceInput, Resource } from '../../graphql/generated/types';
import { fromDBResource } from '../utils/db.mappers';
import { getId, mapSchedule } from '../utils/input.mappers';
import { BadRequestError, ErrorCode } from '../utils/errors';
import { AuthToken } from '../auth/types';

async function addResource(
  db: PrismaClient,
  { id, enabled = true, label = '', schedule, ...resource }: AddResourceInput,
  token: AuthToken
): Promise<Resource> {
  if (resource.seats && resource.seats < 0) {
    throw new BadRequestError(
      `Can not create a resource with less than 0 seats`,
      ErrorCode.INVALID_RESOURCE_ARGUMENTS
    );
  }

  const mappedSchedule = mapSchedule(schedule);

  const result = await db.resource.create({
    data: {
      enabled,
      id: getId(id),
      label,
      schedule: mappedSchedule,
      ...resource,
      customerId: resource.customerId || 'tomfa', // TODO
    },
  });
  return fromDBResource(result);
}

export default addResource;
