import { PrismaClient } from '@prisma/client/scripts/default-index';
import { Customer } from '../../graphql/generated/types';
import { fromDBCustomer } from '../utils/db.mappers';

async function getCustomerByEmail(
  db: PrismaClient,
  issuer: string
): Promise<Customer | null> {
  const customer = await db.customer.findUnique({ where: { issuer } });
  return customer && fromDBCustomer(customer);
}

export default getCustomerByEmail;
