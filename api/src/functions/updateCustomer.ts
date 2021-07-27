import { db } from '../db/client';
import {
  Customer,
  MutationUpdateCustomerArgs,
} from '../graphql/generated/types';
import { fromDBCustomer } from '../utils/db.mappers';
import {
  ErrorCode,
  GenericBookingError,
  ObjectDoesNotExist,
} from '../utils/errors';
import { Auth } from '../auth/types';

async function updateCustomer(
  { updateCustomerInput: args }: MutationUpdateCustomerArgs,
  token: Auth
): Promise<Customer> {
  // TODO: Stop invalid updates, see addCustomer

  try {
    const existing = await db.customer.findById(args.id);
    const customer = await db.customer.update({
      ...existing,
      ...args,
    });
    return fromDBCustomer(customer);
  } catch (err) {
    if (err.code === 'P2025') {
      throw new ObjectDoesNotExist(
        `Customer with id ${args.id} not found`,
        ErrorCode.CUSTOMER_DOES_NOT_EXIST
      );
    }
    console.log(`Unhandled error: ${err}`);
    throw new GenericBookingError(
      `addCustomer failed with unknown error`,
      err.code || ErrorCode.UNKNOWN_ERROR
    );
  }
}

export default updateCustomer;
