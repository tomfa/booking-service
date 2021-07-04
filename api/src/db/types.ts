import { Resource } from '../graphql/generated/types';
import { Customer } from './collections/Customer';
import { Booking } from './collections/Booking';
import { Resource } from './collections/Resource';

export type DBResource = Resource;
export type DBCustomer = Customer;
export type DBBooking = Booking;
export type DBRowValue = true | string | number;
