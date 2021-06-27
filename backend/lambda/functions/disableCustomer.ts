import { PrismaClient } from '@prisma/client';
import { Customer } from '../../graphql/generated/types';
import { fromDBCustomer } from '../utils/db.mappers';
import { AuthToken } from '../auth/types';

async function disableCustomer(
  db: PrismaClient,
  id: string,
  token: AuthToken
): Promise<Customer> {
  // TODO: What if id does not exist?

  const customer = await db.customer.update({
    where: { id },
    data: { enabled: false },
  });
  return fromDBCustomer(customer);
}

export default disableCustomer;
