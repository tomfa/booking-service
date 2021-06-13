import { getDB } from './db';

async function getCustomerById(id: string) {
  try {
    const db = await getDB();
    return await db.customer.findUnique({ where: { id } });
  } catch (err) {
    console.log('Postgres error: ', err);
    return null;
  }
}

export default getCustomerById;
