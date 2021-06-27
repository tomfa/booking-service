import { PrismaClient } from '@prisma/client';
import { Customer } from '../../graphql/generated/types';
import { fromDBCustomer } from '../utils/db.mappers';
import { AuthToken } from '../auth/types';

async function deleteCustomer(
  db: PrismaClient,
  id: string,
  token: AuthToken
): Promise<Customer> {
  const resources = await db.resource.findMany({
    where: { customerId: id },
    select: { id: true },
  });
  const resourceIds = resources.map(r => r.id);
  await db.booking.deleteMany({ where: { resourceId: { in: resourceIds } } });
  await db.resource.deleteMany({ where: { id: { in: resourceIds } } });
  const customer = await db.customer.delete({
    where: { id },
  });
  return fromDBCustomer(customer);
}

export default deleteCustomer;
