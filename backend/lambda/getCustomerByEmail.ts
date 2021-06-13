import { getDB } from './db';

async function getCustomerByEmail(email: string) {
  try {
    const db = await getDB();
    return await db.customer.findUnique({ where: { email } });
  } catch (err) {
    console.log('Postgres error: ', err);
    return null;
  }
}

export default getCustomerByEmail;
