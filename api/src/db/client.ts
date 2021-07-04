// TODO: This shitfest
import { getRepository } from 'fireorm';
import { Booking, Resource } from '../graphql/generated/types';
import { getId } from '../utils/input.mappers';
import { DBBooking, DBResource } from './types';
import { Customer } from './collections/Customer';

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
  customer: {
    create: async (
      partialCustomer: Partial<Customer> & Pick<Customer, 'email'>
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
    repository: getRepository(Customer),
  },
};
export type PrismaClient = typeof db;
