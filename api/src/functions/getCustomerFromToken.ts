import { db } from '../db/client';
import { Customer } from '../graphql/generated/types';
import { fromDBCustomer } from '../utils/db.mappers';
import { Auth } from '../auth/types';
import { hasPermission, permissions } from '../auth/permissions';
import logger from '../utils/logger';
import { EmptyResolverArgs } from '../types';

async function getCustomerFromToken(
  args: EmptyResolverArgs,
  token: Auth
): Promise<Customer | null> {
  if (!hasPermission(token, permissions.GET_OWN_CUSTOMER)) {
    logger.debug(`getCustomerFromToken: permission denied`);
    return null;
  }

  const customer = await db.customer
    .getRepository()
    .whereEqualTo('id', token.customerId)
    .findOne();

  if (customer) {
    logger.debug(`getCustomerFromToken: found customer ${customer}`);
  } else {
    logger.debug(
      `getCustomerFromToken: Could not find customer with id ${token.customerId}`
    );
  }

  return customer && fromDBCustomer(customer);
}

export default getCustomerFromToken;
