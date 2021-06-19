import { Customer } from '../graphql/generated/types';
import { getDB } from './db';
import { fromDBCustomer } from './utils/db.mappers';

async function getCustomerById(id: string): Promise<Customer | null> {
  const db = await getDB();
  const customer = await db.customer.findUnique({ where: { id } });
  return customer && fromDBCustomer(customer);
}

export default getCustomerById;
