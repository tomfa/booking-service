import { db } from '../db/client';
import { Customer } from '../graphql/generated/types';
import { fromDBCustomer } from '../utils/db.mappers';
import { AuthToken } from '../auth/types';

async function getCustomerById(
  id: string,
  token: AuthToken
): Promise<Customer | null> {
  const customer = await db.customer.findUnique({ where: { id } });
  return customer && fromDBCustomer(customer);
}

export default getCustomerById;
