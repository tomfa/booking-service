import { Resource } from '../graphql/generated/types';
import { JSONObject } from '../types';
import { Customer } from './collections/Customer';
import { Booking } from './collections/Booking';

export type DBResource = Omit<Resource, 'schedule'> & { schedule: JSONObject };
export type DBCustomer = Customer;
export type DBBooking = Booking;
export type DBRowValue = true | string | number;
