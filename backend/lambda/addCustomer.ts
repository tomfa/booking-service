import { AddCustomerInput, Customer } from '../graphql/generated/types';
import { getDB } from './db';
import { getId, removeNull } from './utils/input.mappers';
import { ErrorType } from './utils/types';
import { genericErrorResponse } from './utils/response';
import { fromDBCustomer } from './utils/db.mappers';

async function addCustomer({
  id,
  ...rest
}: AddCustomerInput): Promise<Customer | ErrorType> {
  try {
    // TODO: Error handling
    //  - what if id already exists
    const db = await getDB();
    const customer = await db.customer.create(
      removeNull({ data: { id: getId(id), ...rest } })
    );
    return fromDBCustomer(customer);
  } catch (err) {
    console.log('Postgres error: ', err);
    return genericErrorResponse;
  }
}

export default addCustomer;
