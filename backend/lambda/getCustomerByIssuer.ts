import { Customer } from '../graphql/generated/types';
import { getDB } from './db';
import { fromDBCustomer } from './utils/db.mappers';

async function getCustomerByEmail(issuer: string): Promise<Customer | null> {
  const db = await getDB();
  const customer = await db.customer.findUnique({ where: { issuer } });
  return customer && fromDBCustomer(customer);
}

export default getCustomerByEmail;
