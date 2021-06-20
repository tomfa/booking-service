import { PrismaClient } from '@prisma/client';
import { Customer, UpdateCustomerInput } from '../../graphql/generated/types';
import { removeNull } from '../utils/input.mappers';
import { fromDBCustomer } from '../utils/db.mappers';
import {
  ErrorCode,
  GenericBookingError,
  ObjectDoesNotExist,
} from '../utils/errors';

async function updateCustomer(
  db: PrismaClient,
  args: UpdateCustomerInput
): Promise<Customer> {
  // TODO: What if id does not exist?
  // TODO: Stop invalid updates, see addCustomer

  try {
    const customer = await db.customer.update({
      where: { id: args.id },
      data: removeNull(args),
    });
    return fromDBCustomer(customer);
  } catch (err) {
    if (err.code === 'P2025') {
      console.log(err.meta);
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
