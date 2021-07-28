// TODO: This shitfest
import { getRepository } from 'fireorm';
import { getId } from '../utils/input.mappers';
import { Customer } from './collections/Customer';
import { Booking } from './collections/Booking';
import { Resource } from './collections/Resource';

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
  findById: async (id: string): Promise<Booking | null> => {
    const repository = getRepository(Booking);
    const document = await repository.findById(id);
    return document;
  },
};

const resourceDB = {
  getRepository: () => getRepository(Resource),
  create: async (
    partialResource: Omit<Resource, 'id' | 'canceled'> & {
      id?: string;
      canceled?: boolean;
    }
  ): Promise<Resource> => {
    const defaultValues = {
      id: getId(),
      canceled: false,
    };
    const repository = getRepository(Resource);
    const document = await repository.create({
      ...defaultValues,
      ...partialResource,
    });
    return document;
  },
  update: async (resource: Resource): Promise<Resource> => {
    const repository = getRepository(Resource);
    const document = await repository.update(resource);
    return document;
  },
  findById: async (id: string): Promise<Resource> => {
    const repository = getRepository(Resource);
    const document = await repository.findById(id);
    return document;
  },
};

export const db = {
  booking: bookingDB,
  resource: resourceDB,
  customer: customerDB,
};
export type PrismaClient = typeof db;
