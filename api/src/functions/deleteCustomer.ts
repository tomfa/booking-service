import {
  Customer,
  MutationDeleteCustomerArgs,
} from '../graphql/generated/types';
import { AuthToken } from '../auth/types';

import disableCustomer from './disableCustomer';

async function deleteCustomer(
  { id }: MutationDeleteCustomerArgs,
  token: AuthToken
): Promise<Customer> {
  return disableCustomer({ id }, token);
  // const resources = await db.resource.getRepository().whereEqualTo('customerId', i){
  //   where: { customerId: id },
  //   select: { id: true },
  // });
  // const resources = await db.resource.findMany({
  //   where: { customerId: id },
  //   select: { id: true },
  // });
  // if (resources.length) {
  //   const resourceIds = resources.map(r => r.id);
  //   // TODO:
  //   // await db.booking.deleteMany({ where: { resourceId: { in: resourceIds } } });
  //   await db.resource.deleteMany({ where: { id: { in: resourceIds } } });
  // }
  // try {
  //   const customer = await db.customer.findById(id);
  //   await db.customer.getRepository().delete(id);
  //   return fromDBCustomer(customer);
  // } catch (err) {
  //   if (err.code === 'P2025') {
  //     throw new ObjectDoesNotExist(
  //       `Customer with id ${id} not found`,
  //       ErrorCode.CUSTOMER_DOES_NOT_EXIST
  //     );
  //   }
  //   console.log(`Unhandled error: ${err}`);
  //   throw new GenericBookingError(
  //     `addCustomer failed with unknown error`,
  //     err.code || ErrorCode.UNKNOWN_ERROR
  //   );
  // }
}

export default deleteCustomer;
