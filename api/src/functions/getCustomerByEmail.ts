import { db } from '../db/client';
import { Customer } from '../graphql/generated/types';
import { fromDBCustomer } from '../utils/db.mappers';
import { AuthToken } from '../auth/types';

async function getCustomerByEmail(
  email: string,
  token: AuthToken
): Promise<Customer | null> {
  const customer = await db.customer.findUnique({ where: { email } });
  return customer && fromDBCustomer(customer);
}

export default getCustomerByEmail;
