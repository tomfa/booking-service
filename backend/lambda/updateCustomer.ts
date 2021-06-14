import { Customer, UpdateCustomerInput } from '../graphql/generated/types';
import { getDB } from './db';
import { removeNull } from './utils/input.mappers';
import { ErrorType } from './utils/types';
import { genericErrorResponse } from './utils/response';
import { fromDBCustomer } from './utils/db.mappers';

async function updateCustomer(
  args: UpdateCustomerInput
): Promise<Customer | ErrorType> {
  try {
    const db = await getDB();
    const customer = await db.customer.update({
      where: { id: args.id },
      data: removeNull(args),
    });
    return fromDBCustomer(customer);
  } catch (err) {
    console.log('Postgres error: ', err);
    return genericErrorResponse;
  }
}

export default updateCustomer;
