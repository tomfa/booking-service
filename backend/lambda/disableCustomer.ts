import { Customer } from '../graphql/generated/types';
import { getDB } from './db';
import { ErrorType } from './utils/types';
import { genericErrorResponse } from './utils/response';
import { fromDBCustomer } from './utils/db.mappers';

async function disableCustomer(id: string): Promise<Customer | ErrorType> {
  try {
    const db = await getDB();
    const customer = await db.customer.update({
      where: { id },
      data: { enabled: false },
    });
    return fromDBCustomer(customer);
  } catch (err) {
    console.log('Postgres error: ', err);
    return genericErrorResponse;
  }
}

export default disableCustomer;
