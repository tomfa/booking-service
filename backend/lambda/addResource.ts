import db from './db';
import { AddResourceInput } from './types';
import { Tables } from './constants';
const { v4: uuid } = require('uuid');

async function addResource(resource: AddResourceInput) {
  if (!resource.id) resource.id = uuid();
  const {
    id,
    customerId,
    category = null,
    label = null,
    seats,
    enabled = true,
    schedule,
  } = resource;
  try {
    const query = `INSERT INTO ${Tables.Resource} (id,customerId,label,seats,enabled,schedule) VALUES(:id,:customerId,:label,:seats,:enabled,:schedule)`;
    await db.query(query, {
      id,
      customerId,
      category,
      label,
      seats,
      enabled,
      schedule,
    });
    return resource;
  } catch (err) {
    console.log('Postgres error: ', err);
    return null;
  }
}

export default addResource;
