import { db } from '../db/client';
import { Customer } from '../graphql/generated/types';
import { fromDBCustomer } from '../utils/db.mappers';
import { Auth } from '../auth/types';
import { hasPermission, permissions } from '../auth/permissions';
import logger from '../utils/logger';

async function getCustomerFromToken(token: Auth): Promise<Customer | null> {
  if (!hasPermission(token, permissions.GET_OWN_CUSTOMER)) {
    logger.debug(`getCustomerFromToken: permission denied`);
    return null;
  }

  const customer = await db.customer
    .getRepository()
    .whereEqualTo('id', token.customerId)
    .findOne();

  logger.debug(`getCustomerFromToken: found customer ${customer}`);

  return customer && fromDBCustomer(customer);
}

export default getCustomerFromToken;
