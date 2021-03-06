import { IncomingHttpHeaders } from 'http';
import * as types from './graphql/generated/types';
import { BookedDuration, Mutation, Query } from './graphql/generated/types';
import { ErrorType } from './utils/types';

export type EmptyResolverArgs = Record<never, never>;

export type RequestContext = {
  headers: IncomingHttpHeaders;
  // eslint-disable-next-line no-undef
  config: NodeJS.ProcessEnv;
};
export type EntityTypes =
  | types.Resource
  | types.Booking
  | types.Customer
  | types.TimeSlot
  | BookedDuration;
export type SuccessReturnTypes = EntityTypes | EntityTypes[] | null;
export type ErrorReturnTypes = ErrorType;

export type QueryType = keyof Query;
export type MutationType = keyof Mutation;

export type JSONValue =
  | boolean
  | number
  | string
  | null
  | JSONValue[]
  | JSONObject;

export type JSONObject = {
  [key: string]: JSONValue;
};
