import { Customer } from '../graphql/generated/types';
import { getDB } from './db';
import { ErrorType } from './utils/types';
import { genericErrorResponse } from './utils/response';
import { fromDBCustomer } from './utils/db.mappers';

async function getCustomerByEmail(
  email: string
): Promise<Customer | null | ErrorType> {
  try {
    const db = await getDB();
    const customer = await db.customer.findUnique({ where: { email } });
    return customer && fromDBCustomer(customer);
  } catch (err) {
    console.log('Postgres error: ', err);
    return genericErrorResponse;
  }
}

export default getCustomerByEmail;
