import { PrismaClient } from '@prisma/client/scripts/default-index';
import { Customer } from '../../graphql/generated/types';
import { fromDBCustomer } from '../utils/db.mappers';

async function getCustomerByEmail(
  db: PrismaClient,
  email: string
): Promise<Customer | null> {
  const customer = await db.customer.findUnique({ where: { email } });
  return customer && fromDBCustomer(customer);
}

export default getCustomerByEmail;
