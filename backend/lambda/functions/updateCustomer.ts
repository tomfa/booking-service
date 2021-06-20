import { PrismaClient } from '@prisma/client';
import { Customer, UpdateCustomerInput } from '../../graphql/generated/types';
import { removeNull } from '../utils/input.mappers';
import { fromDBCustomer } from '../utils/db.mappers';

async function updateCustomer(
  db: PrismaClient,
  args: UpdateCustomerInput
): Promise<Customer> {
  // TODO: What if id does not exist?

  const customer = await db.customer.update({
    where: { id: args.id },
    data: removeNull(args),
  });
  return fromDBCustomer(customer);
}

export default updateCustomer;
