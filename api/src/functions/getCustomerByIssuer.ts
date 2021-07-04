import { db } from '../db/client';
import {
  Customer,
  QueryGetCustomerByIssuerArgs,
} from '../graphql/generated/types';
import { fromDBCustomer } from '../utils/db.mappers';
import { AuthToken } from '../auth/types';

async function getCustomerByIssuer(
  { issuer }: QueryGetCustomerByIssuerArgs,
  token: AuthToken
): Promise<Customer | null> {
  const customer = await db.customer.findUnique({ where: { issuer } });
  return customer && fromDBCustomer(customer);
}

export default getCustomerByIssuer;
