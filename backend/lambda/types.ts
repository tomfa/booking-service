import * as types from '../graphql/generated/types';
import { BookedDuration } from '../graphql/generated/types';
import { ErrorType } from './utils/types';

export type EntityTypes =
  | types.Resource
  | types.Booking
  | types.Customer
  | types.TimeSlot
  | BookedDuration;
export type SuccessReturnTypes = EntityTypes | EntityTypes[] | null;
export type ErrorReturnTypes = ErrorType;
