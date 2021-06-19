import { Customer } from '../../graphql/generated/types';
import { getDB } from '../db';
import { fromDBCustomer } from '../utils/db.mappers';

async function disableCustomer(id: string): Promise<Customer> {
  // TODO: What if id does not exist?
  const db = await getDB();
  const customer = await db.customer.update({
    where: { id },
    data: { enabled: false },
  });
  return fromDBCustomer(customer);
}

export default disableCustomer;
