import { db } from '../db/client';
import { Customer, QueryGetCustomerByIdArgs } from '../graphql/generated/types';
import { fromDBCustomer } from '../utils/db.mappers';
import { AuthToken } from '../auth/types';

async function getCustomerById(
  { id }: QueryGetCustomerByIdArgs,
  token: AuthToken
): Promise<Customer | null> {
  const customer = await db.customer
    .getRepository()
    .whereEqualTo('id', id)
    .findOne();
  return customer && fromDBCustomer(customer);
}

export default getCustomerById;
