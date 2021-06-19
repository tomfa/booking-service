import { PrismaClient } from '@prisma/client/scripts/default-index';
import { AddCustomerInput, Customer } from '../../graphql/generated/types';
import { getId, removeNull } from '../utils/input.mappers';
import { fromDBCustomer } from '../utils/db.mappers';

async function addCustomer(
  db: PrismaClient,
  { id, ...rest }: AddCustomerInput
): Promise<Customer> {
  // TODO: what if id already exists

  const customer = await db.customer.create(
    removeNull({ data: { id: getId(id), ...rest } })
  );
  return fromDBCustomer(customer);
}

export default addCustomer;
