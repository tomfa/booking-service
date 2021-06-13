import { getDB } from './db';

async function disableCustomer(id: string) {
  try {
    const db = await getDB();
    const customer = await db.customer.update({
      where: { id },
      data: { enabled: false },
    });
    return customer;
  } catch (err) {
    console.log('Postgres error: ', err);
    return null;
  }
}

export default disableCustomer;
