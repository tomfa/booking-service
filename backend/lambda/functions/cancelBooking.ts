import { PrismaClient } from '@prisma/client';
import { Booking } from '../../graphql/generated/types';
import { fromDBBooking } from '../utils/db.mappers';
import { AuthToken } from '../auth/types';

async function cancelBooking(
  db: PrismaClient,
  id: string,
  token: AuthToken
): Promise<Booking> {
  // TODO: What if ID does not exits
  const booking = await db.booking.update({
    where: { id },
    data: { canceled: true },
  });
  return fromDBBooking(booking);
}

export default cancelBooking;
