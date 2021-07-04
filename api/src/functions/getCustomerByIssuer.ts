import { db } from '../db/client';
import { Customer } from '../graphql/generated/types';
import { fromDBCustomer } from '../utils/db.mappers';
import { AuthToken } from '../auth/types';

async function getCustomerByEmail(
  issuer: string,
  token: AuthToken
): Promise<Customer | null> {
  const customer = await db.customer.findUnique({ where: { issuer } });
  return customer && fromDBCustomer(customer);
}

export default getCustomerByEmail;
