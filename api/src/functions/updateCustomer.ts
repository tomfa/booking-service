import { db } from '../db/client';
import {
  Customer,
  MutationUpdateCustomerArgs,
} from '../graphql/generated/types';
import { fromDBCustomer } from '../utils/db.mappers';
import { ErrorCode, ObjectDoesNotExist } from '../utils/errors';
import { Auth } from '../auth/types';
import { permissions, verifyPermission } from '../auth/permissions';

async function updateCustomer(
  { updateCustomerInput: args }: MutationUpdateCustomerArgs,
  token: Auth
): Promise<Customer> {
  // TODO: Stop invalid updates, see addCustomer
  verifyPermission(token, permissions.UPDATE_CUSTOMER);

  const existing = await db.customer.findById(args.id);
  if (!existing) {
    throw new ObjectDoesNotExist(
      `Customer with id ${args.id} not found`,
      ErrorCode.CUSTOMER_DOES_NOT_EXIST
    );
  }
  const customer = await db.customer.update({
    ...existing,
    ...args,
  });
  return fromDBCustomer(customer);
}

export default updateCustomer;
