import { Prisma } from '@prisma/client';
import { Resource, UpdateResourceInput } from '../graphql/generated/types';
import { getDB } from './db';
import { mapSchedule, removeNull } from './utils/input.mappers';
import { ErrorType } from './utils/types';
import { fromDBResource } from './utils/db.mappers';

const mapResourceUpdate = (
  args: UpdateResourceInput
): Prisma.resourceUpdateInput => {
  if (args.schedule) {
    return {
      ...removeNull(args),
      schedule: mapSchedule(args.schedule),
    };
  }
  return removeNull(args);
};

async function updateResource(
  args: UpdateResourceInput
): Promise<Resource | null | ErrorType> {
  try {
    const db = await getDB();
    const resource = await db.resource.update({
      where: { id: args.id },
      data: mapResourceUpdate(args),
    });
    return fromDBResource(resource);
  } catch (err) {
    console.log('Postgres error: ', err);
    return null;
  }
}

export default updateResource;
