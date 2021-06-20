import { PrismaClient } from '@prisma/client';
import { AddResourceInput, Resource } from '../../graphql/generated/types';
import { fromDBResource } from '../utils/db.mappers';
import { getId, mapSchedule } from '../utils/input.mappers';

async function addResource(
  db: PrismaClient,
  { id, enabled = true, label = '', schedule, ...resource }: AddResourceInput
): Promise<Resource> {
  // TODO: Error handling
  //  - what if id already exists

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
