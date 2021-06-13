import { getDB } from './db';

async function disableResource(id: string) {
  try {
    const db = await getDB();
    return await db.resource.update({
      where: { id },
      data: { enabled: false },
    });
  } catch (err) {
    console.log('Postgres error: ', err);
    return null;
  }
}

export default disableResource;
