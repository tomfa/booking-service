import { db } from '../db/client';
import { Customer, QueryGetCustomerByIdArgs } from '../graphql/generated/types';
import { fromDBCustomer } from '../utils/db.mappers';
import { Auth } from '../auth/types';
import { permissions, verifyPermission } from '../auth/permissions';

async function getCustomerById(
  { id }: QueryGetCustomerByIdArgs,
  token: Auth
): Promise<Customer | null> {
  verifyPermission(token, permissions.GET_CUSTOMER);
  const customer = await db.customer
    .getRepository()
    .whereEqualTo('id', id)
    .findOne();
  return customer && fromDBCustomer(customer);
}

export default getCustomerById;
