import { PrismaClient } from '@prisma/client';
import { Customer } from '../../graphql/generated/types';
import { fromDBCustomer } from '../utils/db.mappers';

async function getCustomerById(
  db: PrismaClient,
  id: string
): Promise<Customer | null> {
  const customer = await db.customer.findUnique({ where: { id } });
  return customer && fromDBCustomer(customer);
}

export default getCustomerById;
