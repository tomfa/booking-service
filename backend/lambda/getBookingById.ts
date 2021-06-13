import { getDB } from './db';

async function getBookingById(id: string) {
  try {
    const db = await getDB();
    return await db.booking.findUnique({
      where: { id },
      include: { resource: true },
    });
  } catch (err) {
    console.log('Postgres error: ', err);
    return null;
  }
}

export default getBookingById;
