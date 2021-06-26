import { Prisma, PrismaClient } from '@prisma/client';

import {
  FindResourceInput,
  Resource,
  Schedule,
} from '../../graphql/generated/types';
import { removeNull } from '../utils/input.mappers';
import { closedSchedule } from '../utils/schedule.utils';
import { fromDBResource } from '../utils/db.mappers';

const mapSchedule = (val: Prisma.JsonValue): Schedule => {
  if (!val) {
    return closedSchedule;
  }
  return val as Schedule;
};

async function findResources(
  db: PrismaClient,
  { resourceIds, ...args }: FindResourceInput
): Promise<Resource[]> {
  const clean = removeNull({ ...args });
  const resources = await db.resource.findMany({
    where: {
      id: (resourceIds && { in: resourceIds }) || undefined,
      ...clean,
    },
  });
  return resources.map(fromDBResource);
}

export default findResources;
