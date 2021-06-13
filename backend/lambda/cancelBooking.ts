import { getDB } from './db';

async function cancelBooking(id: string) {
  try {
    const db = await getDB();
    const booking = await db.booking.update({
      where: { id },
      data: { canceled: true },
    });
    return booking;
  } catch (err) {
    console.log('Postgres error: ', err);
    return null;
  }
}

export default cancelBooking;
