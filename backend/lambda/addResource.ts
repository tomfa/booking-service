import { AddResourceInput, Resource } from '../graphql/generated/types';
import { getDB } from './db';
import { fromDBResource } from './utils/db.mappers';
import { getId, mapSchedule } from './utils/input.mappers';
import { ErrorType } from './utils/types';
import { genericErrorResponse } from './utils/response';

async function addResource({
  id,
  enabled = true,
  label = '',
  schedule,
  ...resource
}: AddResourceInput): Promise<Resource | ErrorType> {
  // TODO: Error handling
  //  - what if id already exists
  try {
    const mappedSchedule = mapSchedule(schedule);
    const db = await getDB();
    const result = await db.resource.create({
      data: {
        enabled,
        id: getId(id),
        label,
        schedule: mappedSchedule,
        ...resource,
      },
    });
    return fromDBResource(result);
  } catch (err) {
    console.log('Postgres error: ', err);
    return genericErrorResponse;
  }
}

export default addResource;
