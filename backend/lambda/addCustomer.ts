import { AddCustomerInput, Customer } from '../graphql/generated/types';
import { getDB } from './db';
import { getId, removeNull } from './utils/input.mappers';
import { fromDBCustomer } from './utils/db.mappers';

async function addCustomer({
  id,
  ...rest
}: AddCustomerInput): Promise<Customer> {
  // TODO: what if id already exists
  const db = await getDB();
  const customer = await db.customer.create(
    removeNull({ data: { id: getId(id), ...rest } })
  );
  return fromDBCustomer(customer);
}

export default addCustomer;
