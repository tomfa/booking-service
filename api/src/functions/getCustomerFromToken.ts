import { db } from '../db/client';
import { Customer } from '../graphql/generated/types';
import { fromDBCustomer } from '../utils/db.mappers';
import { Auth } from '../auth/types';
import { hasPermission, permissions } from '../auth/permissions';

async function getCustomerFromToken(token: Auth): Promise<Customer | null> {
  if (!hasPermission(token, permissions.GET_OWN_CUSTOMER)) {
    return null;
  }

  const customer = await db.customer
    .getRepository()
    .whereEqualTo('id', token.customerId)
    .findOne();

  return customer && fromDBCustomer(customer);
}

export default getCustomerFromToken;
