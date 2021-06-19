import { Customer, UpdateCustomerInput } from '../graphql/generated/types';
import { getDB } from './db';
import { removeNull } from './utils/input.mappers';
import { fromDBCustomer } from './utils/db.mappers';

async function updateCustomer(args: UpdateCustomerInput): Promise<Customer> {
  // TODO: What if id does not exist?
  const db = await getDB();
  const customer = await db.customer.update({
    where: { id: args.id },
    data: removeNull(args),
  });
  return fromDBCustomer(customer);
}

export default updateCustomer;
