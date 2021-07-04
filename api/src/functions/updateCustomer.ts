import { db } from '../db/client';
import {
  Customer,
  MutationUpdateCustomerArgs,
} from '../graphql/generated/types';
import { removeNull } from '../utils/input.mappers';
import { fromDBCustomer } from '../utils/db.mappers';
import {
  ErrorCode,
  GenericBookingError,
  ObjectDoesNotExist,
} from '../utils/errors';
import { AuthToken } from '../auth/types';

async function updateCustomer(
  { updateCustomerInput: args }: MutationUpdateCustomerArgs,
  token: AuthToken
): Promise<Customer> {
  // TODO: Stop invalid updates, see addCustomer

  try {
    const customer = await db.customer.update({
      where: { id: args.id },
      data: removeNull(args),
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
