import { db } from '../db/client';
import {
  Customer,
  MutationDisableCustomerArgs,
} from '../graphql/generated/types';
import { fromDBCustomer } from '../utils/db.mappers';
import { Auth } from '../auth/types';
import {
  ErrorCode,
  GenericBookingError,
  ObjectDoesNotExist,
} from '../utils/errors';

async function disableCustomer(
  { id }: MutationDisableCustomerArgs,
  token: Auth
): Promise<Customer> {
  // TODO: What if id does not exist?

  try {
    const existing = await db.customer.findById(id);
    const customer = await db.customer.update({ ...existing, enabled: false });
    return fromDBCustomer(customer);
  } catch (err) {
    if (err.code === 'P2025') {
      throw new ObjectDoesNotExist(
        `Customer with id ${id} not found`,
        ErrorCode.CUSTOMER_DOES_NOT_EXIST
      );
    }
    console.log(`Unhandled error: ${err}`);
    throw new GenericBookingError(
      `disableCustomer failed with unknown error`,
      err.code || ErrorCode.UNKNOWN_ERROR
    );
  }
}

export default disableCustomer;
