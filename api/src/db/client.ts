// TODO: This shitfest
import { getRepository } from 'fireorm';
import { Resource } from '../graphql/generated/types';
import { getId } from '../utils/input.mappers';
import { DBBooking, DBResource } from './types';
import { Customer } from './collections/Customer';
import { Booking } from './collections/Booking';

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

const customerDB = {
  create: async (
    partialCustomer: Omit<Customer, 'credits' | 'enabled'> & {
      credits?: number;
      enabled?: boolean;
    }
  ): Promise<Customer> => {
    const defaultValues = {
      id: getId(),
      credits: -1,
      enabled: true,
    };
    const repository = getRepository(Customer);
    const document = await repository.create({
      ...defaultValues,
      ...partialCustomer,
    });
    return document;
  },
  update: async (customer: Customer): Promise<Customer> => {
    const repository = getRepository(Customer);
    const document = await repository.update(customer);
    return document;
  },
  findById: async (id: string): Promise<Customer> => {
    const repository = getRepository(Customer);
    const document = await repository.findById(id);
    return document;
  },
  getRepository: () => getRepository(Customer),
};

const bookingDB = {
  getRepository: () => getRepository(Booking),
  create: async (
    partialBooking: Omit<Booking, 'id' | 'canceled'> & {
      id?: string;
      canceled?: boolean;
    }
  ): Promise<Booking> => {
    const defaultValues = {
      id: getId(),
      canceled: false,
    };
    const repository = getRepository(Booking);
    const document = await repository.create({
      ...defaultValues,
      ...partialBooking,
    });
    return document;
  },
  update: async (booking: Booking): Promise<Booking> => {
    const repository = getRepository(Booking);
    const document = await repository.update(booking);
    return document;
  },
  findById: async (id: string): Promise<Booking> => {
    const repository = getRepository(Booking);
    const document = await repository.findById(id);
    return document;
  },
  findMany: (data: unknown): Promise<DBBooking[]> => Promise.resolve([]),
  deleteMany: (data: unknown) => {},
  delete: (data: unknown): Promise<DBBooking> =>
    Promise.resolve(data as DBBooking),
  findUnique: (data: unknown): Promise<DBBooking | null> =>
    Promise.resolve(null),
};

export const db = {
  booking: bookingDB,
  resource: dbHandler<Resource, DBResource>('resource'),
  customer: customerDB,
};
export type PrismaClient = typeof db;
