import { Resource } from '../graphql/generated/types';
import { getDB } from './db';
import { ErrorType } from './utils/types';
import { fromDBResource } from './utils/db.mappers';
import { genericErrorResponse } from './utils/response';

async function getResourceById(
  id: string
): Promise<Resource | null | ErrorType> {
  try {
    const db = await getDB();
    const resource = await db.resource.findUnique({ where: { id } });
    return resource && fromDBResource(resource);
  } catch (err) {
    console.log('Postgres error: ', err);
    return genericErrorResponse;
  }
}

export default getResourceById;
