import { db } from '../db/client';
import {
  Customer,
  QueryGetCustomerByIssuerArgs,
} from '../graphql/generated/types';
import { fromDBCustomer } from '../utils/db.mappers';
import { Auth } from '../auth/types';

async function getCustomerByIssuer(
  { issuer }: QueryGetCustomerByIssuerArgs,
  token?: Auth
): Promise<Customer | null> {
  const customer = await db.customer
    .getRepository()
    .whereEqualTo('issuer', issuer)
    .findOne();
  return customer && fromDBCustomer(customer);
}

export default getCustomerByIssuer;
