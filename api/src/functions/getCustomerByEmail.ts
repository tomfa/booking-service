import { db } from '../db/client';
import {
  Customer,
  QueryGetCustomerByEmailArgs,
} from '../graphql/generated/types';
import { fromDBCustomer } from '../utils/db.mappers';
import { AuthToken } from '../auth/types';

async function getCustomerByEmail(
  { email }: QueryGetCustomerByEmailArgs,
  token: AuthToken
): Promise<Customer | null> {
  const customer = await db.customer.repository
    .whereEqualTo('email', email)
    .findOne();
  return customer && fromDBCustomer(customer);
}

export default getCustomerByEmail;
