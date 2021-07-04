// TODO: This shitfest
import { Booking, Customer, Resource } from '../graphql/generated/types';
import { DBBooking, DBCustomer, DBResource } from './types';

function dbHandler<T, D>(tableName: string) {
  return {
    create: (data: unknown): Promise<D> => Promise.resolve(data as D),
    update: (data: unknown): Promise<D> => Promise.resolve(data as D),
    findMany: (data: unknown): Promise<D[]> => Promise.resolve([]),
    deleteMany: (data: unknown) => {},
    delete: (data: unknown): Promise<D> => Promise.resolve(data as D),
    findUnique: (data: unknown): Promise<D | null> => Promise.resolve(null),
  };
}

export const db = {
  booking: dbHandler<Booking, DBBooking>('booking'),
  resource: dbHandler<Resource, DBResource>('resource'),
  customer: dbHandler<Customer, DBCustomer>('customer'),
};
export type PrismaClient = typeof db;
