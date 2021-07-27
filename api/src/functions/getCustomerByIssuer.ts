import { db } from '../db/client';
import {
  Customer,
  QueryGetCustomerByIssuerArgs,
} from '../graphql/generated/types';
import { fromDBCustomer } from '../utils/db.mappers';
import { Auth } from '../auth/types';
import { permissions, verifyPermission } from '../auth/permissions';

async function getCustomerByIssuer(
  { issuer }: QueryGetCustomerByIssuerArgs,
  token?: Auth
): Promise<Customer | null> {
  if (token) {
    verifyPermission(token, permissions.GET_CUSTOMER);
  }
  const customer = await db.customer
    .getRepository()
    .whereEqualTo('issuer', issuer)
    .findOne();
  return customer && fromDBCustomer(customer);
}

export default getCustomerByIssuer;
