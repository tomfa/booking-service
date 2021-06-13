import { AddCustomerInput } from './types';
import { getDB } from './db';

const { v4: uuid } = require('uuid');

async function addCustomer({ id = uuid(), ...rest }: AddCustomerInput) {
  try {
    const db = await getDB();
    return db.customer.create({ data: { id, ...rest } });
  } catch (err) {
    console.log('Postgres error: ', err);
    return null;
  }
}

export default addCustomer;
