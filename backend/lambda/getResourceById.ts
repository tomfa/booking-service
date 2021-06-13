import { getDB } from './db';

async function getResourceById(id: string) {
  try {
    const db = await getDB();
    return await db.resource.findUnique({ where: { id } });
  } catch (err) {
    console.log('Postgres error: ', err);
    return null;
  }
}

export default getResourceById;
