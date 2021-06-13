import { getDB } from './db';

async function getCustomerByEmail(issuer: string) {
  try {
    const db = await getDB();
    return await db.customer.findUnique({ where: { issuer } });
  } catch (err) {
    console.log('Postgres error: ', err);
    return null;
  }
}

export default getCustomerByEmail;
