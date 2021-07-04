import { TimeSlot } from '../graphql/generated/types';
import { AuthToken } from '../auth/types';
import findAvailability from './findAvailability';

export type FindNextAvailableInput = { id: string; afterDate: number };
async function getNextAvailable(
  { id, afterDate }: FindNextAvailableInput,
  token: AuthToken
): Promise<TimeSlot | null> {
  const slots = await findAvailability(
    {
      from: afterDate,
      resourceIds: [id],
    },
    token
  );

  const firstAvailableSlot = slots
    .sort((a, b) => {
      if (a.start < b.start) return -1;
      if (a.start > b.start) return 1;
      return 0;
    })
    .find(s => s.availableSeats > 0);
  return firstAvailableSlot || null;
}

export default getNextAvailable;
