import addBooking from '../functions/addBooking';
import addResource from '../functions/addResource';
import addCustomer from '../functions/addCustomer';
import cancelBooking from '../functions/cancelBooking';
import deleteCustomer from '../functions/deleteCustomer';
import disableResource from '../functions/disableResource';
import setBookingComment, {
  SetBookingCommentInput,
} from '../functions/setBookingComment';
import updateCustomer from '../functions/updateCustomer';
import disableCustomer from '../functions/disableCustomer';
import findAvailability from '../functions/findAvailability';
import findResources from '../functions/findResources';
import findBookings from '../functions/findBookings';
import getBookedDuration from '../functions/getBookedDuration';
import getBookingById from '../functions/getBookingById';
import getCustomerByEmail from '../functions/getCustomerByEmail';
import getCustomerById from '../functions/getCustomerById';
import getCustomerByIssuer from '../functions/getCustomerByIssuer';
import getLatestBooking from '../functions/getLatestBooking';
import getNextAvailable, {
  FindNextAvailableInput,
} from '../functions/getNextAvailable';
import getResourceById from '../functions/getResourceById';
import updateResource from '../functions/updateResource';
import { db } from '../db/client';
import { getVerifiedTokenData } from '../auth/jwt';
import { AuthToken } from '../auth/types';
import {
  AddBookingInput,
  AddCustomerInput,
  AddResourceInput,
  FindAvailabilityInput,
  FindBookingInput,
  FindResourceInput,
  UpdateCustomerInput,
  UpdateResourceInput,
} from './generated/types';

async function resolverWrapper<T>(
  fun: (args: T, token: AuthToken) => Promise<unknown>
) {
  return async (
    parent: unknown,
    args: unknown,
    context: unknown,
    info: unknown
  ) => {
    console.log('parent', parent);
    console.log('args', args);
    console.log('context', context);
    console.log('info', info);
    const token = await getVerifiedTokenData(
      // @ts-ignore
      context.headers['x-authorization'],
      db
    );
    return fun(args as T, token);
  };
}

export const resolvers = {
  Query: {
    findAvailability: resolverWrapper<FindAvailabilityInput>(findAvailability),
    findResources: resolverWrapper<FindResourceInput>(findResources),
    findBookings: resolverWrapper<FindBookingInput>(findBookings),
    getBookedDuration: resolverWrapper<FindBookingInput>(getBookedDuration),
    getBookingById: resolverWrapper<string>(getBookingById),
    getCustomerByEmail: resolverWrapper<string>(getCustomerByEmail),
    getCustomerById: resolverWrapper<string>(getCustomerById),
    getCustomerByIssuer: resolverWrapper<string>(getCustomerByIssuer),
    getLatestBooking: resolverWrapper<FindBookingInput>(getLatestBooking),
    getNextAvailable: resolverWrapper<FindNextAvailableInput>(getNextAvailable),
    getResourceById: resolverWrapper<string>(getResourceById),
  },
  Mutation: {
    addBooking: resolverWrapper<AddBookingInput>(addBooking),
    addCustomer: resolverWrapper<AddCustomerInput>(addCustomer),
    addResource: resolverWrapper<AddResourceInput>(addResource),
    cancelBooking: resolverWrapper<string>(cancelBooking),
    deleteCustomer: resolverWrapper<string>(deleteCustomer),
    disableResource: resolverWrapper<string>(disableResource),
    setBookingComment: resolverWrapper<SetBookingCommentInput>(
      setBookingComment
    ),
    updateCustomer: resolverWrapper<UpdateCustomerInput>(updateCustomer),
    updateResource: resolverWrapper<UpdateResourceInput>(updateResource),
    disableCustomer: resolverWrapper<string>(disableCustomer),
  },
};
