import { Resource } from '../graphql/generated/types';
import { getDB } from './db';
import { ErrorType } from './utils/types';
import { fromDBResource } from './utils/db.mappers';
import { genericErrorResponse } from './utils/response';

async function disableResource(id: string): Promise<Resource | ErrorType> {
  try {
    const db = await getDB();
    const resource = await db.resource.update({
      where: { id },
      data: { enabled: false },
    });
    return fromDBResource(resource);
  } catch (err) {
    console.log('Postgres error: ', err);
    return genericErrorResponse;
  }
}

export default disableResource;
