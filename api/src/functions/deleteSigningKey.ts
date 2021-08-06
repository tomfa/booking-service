import { db } from '../db/client';
import {
  Customer,
  MutationDeleteSigningKeyArgs,
} from '../graphql/generated/types';
import { fromDBCustomer } from '../utils/db.mappers';
import { Auth } from '../auth/types';
import {
  ErrorCode,
  GenericBookingError,
  ObjectDoesNotExist,
} from '../utils/errors';
import { permissions, verifyPermission } from '../auth/permissions';

async function deleteSigningKey(
  { key, customerId }: MutationDeleteSigningKeyArgs,
  token: Auth
): Promise<Customer> {
  if (customerId && customerId !== token.customerId) {
    verifyPermission(token, permissions.ALL);
  }

  verifyPermission(token, permissions.UPDATE_OWN_CUSTOMER);

  try {
    const existing = await db.customer.findById(customerId);
    if (!existing) {
      throw new ObjectDoesNotExist(
        `Customer with id ${customerId} not found`,
        ErrorCode.CUSTOMER_DOES_NOT_EXIST
      );
    }
    if (!existing.publicKeys.includes(key)) {
      return fromDBCustomer(existing);
    }
    const publicKeys = existing.publicKeys.filter(k => k !== key);
    const customer = await db.customer.update({ ...existing, publicKeys });
    return fromDBCustomer(customer);
  } catch (err) {
    throw new GenericBookingError(
      `deleteSigningKey failed with unknown error`,
      err.code || ErrorCode.UNKNOWN_ERROR
    );
  }
}

export default deleteSigningKey;
