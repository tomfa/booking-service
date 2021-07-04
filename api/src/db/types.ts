import { Booking, Resource } from '../graphql/generated/types';
import { JSONObject } from '../types';
import { Customer } from './collections/Customer';

export type DBBooking = Omit<Booking, 'start' | 'end'> & {
  startTime: Date;
  endTime: Date;
};
export type DBResource = Omit<Resource, 'schedule'> & { schedule: JSONObject };
export type DBCustomer = Customer;

export type DBRowValue = true | string | number;
