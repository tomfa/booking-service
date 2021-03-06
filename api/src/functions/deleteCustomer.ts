import {
  Customer,
  MutationDeleteCustomerArgs,
} from '../graphql/generated/types';
import { Auth } from '../auth/types';

import { db } from '../db/client';
import { fromDBCustomer } from '../utils/db.mappers';
import { ErrorCode, ObjectDoesNotExist } from '../utils/errors';
import { permissions, verifyPermission } from '../auth/permissions';

async function deleteCustomer(
  { id }: MutationDeleteCustomerArgs,
  token: Auth
): Promise<Customer> {
  verifyPermission(token, permissions.DELETE_CUSTOMER);
  // TODO: Disable in prod, this is just a test method
  // TODO: Optimize this method, using createBatch.
  const customer = await db.customer.findById(id);
  if (!customer) {
    throw new ObjectDoesNotExist(
      `Customer with id ${id} not found`,
      ErrorCode.CUSTOMER_DOES_NOT_EXIST
    );
  }
  const resources = await db.resource
    .getRepository()
    .whereEqualTo('customerId', id)
    .find();
  const resourceIds = resources.map(r => r.id);
  if (resourceIds.length) {
    const bookings = await db.booking
      .getRepository()
      .whereIn('resourceId', resourceIds)
      .find();
    if (bookings.length) {
      const bookingDeleteBatch = await db.booking.getRepository().createBatch();
      bookings.forEach(b => bookingDeleteBatch.delete(b));
      await bookingDeleteBatch.commit();
    }

    const resourceDeleteBatch = await db.resource.getRepository().createBatch();
    resources.forEach(r => resourceDeleteBatch.delete(r));
    await resourceDeleteBatch.commit();
  }
  await db.customer.getRepository().delete(id);
  return fromDBCustomer(customer);
}

export default deleteCustomer;
