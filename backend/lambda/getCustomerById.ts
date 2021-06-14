import { Customer } from '../graphql/generated/types';
import { getDB } from './db';
import { ErrorType } from './utils/types';
import { fromDBCustomer } from './utils/db.mappers';

async function getCustomerById(
  id: string
): Promise<Customer | null | ErrorType> {
  try {
    const db = await getDB();
    const customer = await db.customer.findUnique({ where: { id } });
    return customer && fromDBCustomer(customer);
  } catch (err) {
    console.log('Postgres error: ', err);
    return null;
  }
}

export default getCustomerById;
