import { PrismaClient } from '@prisma/client';
import { Customer } from '../../graphql/generated/types';
import { fromDBCustomer } from '../utils/db.mappers';

async function disableCustomer(
  db: PrismaClient,
  id: string
): Promise<Customer> {
  // TODO: What if id does not exist?

  const customer = await db.customer.update({
    where: { id },
    data: { enabled: false },
  });
  return fromDBCustomer(customer);
}

export default disableCustomer;
