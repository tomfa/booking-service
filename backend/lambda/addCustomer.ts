import { AddCustomerInput } from '../graphql/generated/types';
import { getDB } from './db';
import { getId, removeNull } from './utils/mappers';

async function addCustomer({ id, ...rest }: AddCustomerInput) {
  try {
    const db = await getDB();
    return db.customer.create(removeNull({ data: { id: getId(id), ...rest } }));
  } catch (err) {
    console.log('Postgres error: ', err);
    return null;
  }
}

export default addCustomer;
