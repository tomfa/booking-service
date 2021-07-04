import { Booking, Customer, Resource } from '../graphql/generated/types';
import { JSONObject } from '../types';

export type DBBooking = Omit<Booking, 'start' | 'end'> & {
  startTime: Date;
  endTime: Date;
};
export type DBCustomer = Customer;
export type DBResource = Omit<Resource, 'schedule'> & { schedule: JSONObject };
