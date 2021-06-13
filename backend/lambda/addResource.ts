import { AddResourceInput } from './types';
import { getDB } from './db';

const { v4: uuid } = require('uuid');

async function addResource({
  id = uuid(),
  enabled = true,
  label = '',
  ...resource
}: AddResourceInput) {
  try {
    const db = await getDB();
    return await db.resource.create({
      data: { enabled, id, label, ...resource },
    });
  } catch (err) {
    console.log('Postgres error: ', err);
    return null;
  }
}

export default addResource;
