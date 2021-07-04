import { db } from '../db/client';
import {
  Customer,
  MutationDeleteCustomerArgs,
} from '../graphql/generated/types';
import { fromDBCustomer } from '../utils/db.mappers';
import { AuthToken } from '../auth/types';
import {
  ErrorCode,
  GenericBookingError,
  ObjectDoesNotExist,
} from '../utils/errors';

async function deleteCustomer(
  { id }: MutationDeleteCustomerArgs,
  token: AuthToken
): Promise<Customer> {
  const resources = await db.resource.findMany({
    where: { customerId: id },
    select: { id: true },
  });
  if (resources.length) {
    const resourceIds = resources.map(r => r.id);
    await db.booking.deleteMany({ where: { resourceId: { in: resourceIds } } });
    await db.resource.deleteMany({ where: { id: { in: resourceIds } } });
  }
  try {
    const customer = await db.customer.delete({
      where: { id },
    });
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
      `addCustomer failed with unknown error`,
      err.code || ErrorCode.UNKNOWN_ERROR
    );
  }
}

export default deleteCustomer;
