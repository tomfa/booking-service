import { db } from '../db/client';
import { AddCustomerInput, Customer } from '../graphql/generated/types';
import { getId, removeNull } from '../utils/input.mappers';
import { fromDBCustomer } from '../utils/db.mappers';
import {
  BadRequestError,
  ErrorCode,
  GenericBookingError,
} from '../utils/errors';
import { AuthToken } from '../auth/types';

async function addCustomer(
  { id, ...rest }: AddCustomerInput,
  token: AuthToken
): Promise<Customer> {
  // TODO: what if id already exists
  // TODO: validate more input: issuer, phoneNumber...
  // TODO:

  try {
    const customer = await db.customer.create(
      removeNull({ data: { id: getId(id), ...rest } })
    );
    return fromDBCustomer(customer);
  } catch (err) {
    if (err.code === 'P2002') {
      const fields = err.meta
        ? (err.meta as Record<string, string[]>).target
        : [];
      throw new BadRequestError(
        `Customer already exists with same values for fields: ${fields}`,
        ErrorCode.CONFLICTS_WITH_EXISTING_RESOURCE
      );
    }
    console.log(`Unhandled error: ${err}`);
    throw new GenericBookingError(
      `addCustomer failed with unknown error`,
      err.code || ErrorCode.UNKNOWN_ERROR
    );
  }
}

export default addCustomer;
