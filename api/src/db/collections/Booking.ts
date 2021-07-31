import { Collection } from 'fireorm';

@Collection()
export class Booking {
  id: string;
  userId?: string;
  resourceId: string;
  customerId: string;
  start: Date;
  end: Date;
  canceled: boolean;
  comment?: string;
  seatNumber?: number;
}
