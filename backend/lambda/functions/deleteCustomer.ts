import { PrismaClient } from '@prisma/client';
import { Customer } from '../../graphql/generated/types';
import { fromDBCustomer } from '../utils/db.mappers';

async function deleteCustomer(db: PrismaClient, id: string): Promise<Customer> {
  // TODO: Implement

  const customer = await db.customer.update({
    where: { id },
    data: { enabled: false },
  });
  return fromDBCustomer(customer);
}

export default deleteCustomer;
