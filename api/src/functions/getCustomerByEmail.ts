import { db } from '../db/client';
import {
  Customer,
  QueryGetCustomerByEmailArgs,
} from '../graphql/generated/types';
import { fromDBCustomer } from '../utils/db.mappers';
import { Auth } from '../auth/types';
import { permissions, verifyPermission } from '../auth/permissions';

async function getCustomerByEmail(
  { email }: QueryGetCustomerByEmailArgs,
  token: Auth
): Promise<Customer | null> {
  verifyPermission(token, permissions.GET_CUSTOMER);
  const customer = await db.customer
    .getRepository()
    .whereEqualTo('email', email)
    .findOne();
  return customer && fromDBCustomer(customer);
}

export default getCustomerByEmail;
