import addBooking from '../functions/addBooking';
import addResource from '../functions/addResource';
import addCustomer from '../functions/addCustomer';
import cancelBooking from '../functions/cancelBooking';
import deleteCustomer from '../functions/deleteCustomer';
import disableResource from '../functions/disableResource';
import setBookingComment from '../functions/setBookingComment';
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
import getNextAvailable from '../functions/getNextAvailable';
import getResourceById from '../functions/getResourceById';
import updateResource from '../functions/updateResource';
import { getVerifiedTokenData } from '../auth/jwt';
import { Auth } from '../auth/types';
import { RequestContext } from '../types';
import addSigningKey from '../functions/addSigningKey';
import deleteSigningKey from '../functions/deleteSigningKey';
import getCustomerFromToken from '../functions/getCustomerFromToken';
import {
  MutationAddBookingArgs,
  MutationAddCustomerArgs,
  MutationAddResourceArgs,
  MutationAddSigningKeyArgs,
  MutationCancelBookingArgs,
  MutationDeleteCustomerArgs,
  MutationDeleteSigningKeyArgs,
  MutationDisableCustomerArgs,
  MutationDisableResourceArgs,
  MutationSetBookingCommentArgs,
  MutationUpdateCustomerArgs,
  MutationUpdateResourceArgs,
  QueryFindAvailabilityArgs,
  QueryFindBookingsArgs,
  QueryFindResourcesArgs,
  QueryGetBookedDurationArgs,
  QueryGetBookingByIdArgs,
  QueryGetCustomerByEmailArgs,
  QueryGetCustomerByIdArgs,
  QueryGetCustomerByIssuerArgs,
  QueryGetLatestBookingArgs,
  QueryGetNextAvailableArgs,
  QueryGetResourceByIdArgs,
} from './generated/types';

function resolverWrapper<T>(fun: (args: T, token: Auth) => Promise<unknown>) {
  return async (parent: unknown, args: T, { headers }: RequestContext) => {
    const authHeader = headers.authorization || headers['x-authorization'];
    const token = await getVerifiedTokenData(authHeader && String(authHeader));
    return fun(args as T, token);
  };
}

export const resolvers = {
  Query: {
    me: resolverWrapper<undefined>(getCustomerFromToken),
    findAvailability: resolverWrapper<QueryFindAvailabilityArgs>(
      findAvailability
    ),
    findResources: resolverWrapper<QueryFindResourcesArgs>(findResources),
    findBookings: resolverWrapper<QueryFindBookingsArgs>(findBookings),
    getBookedDuration: resolverWrapper<QueryGetBookedDurationArgs>(
      getBookedDuration
    ),
    getBookingById: resolverWrapper<QueryGetBookingByIdArgs>(getBookingById),
    getCustomerByEmail: resolverWrapper<QueryGetCustomerByEmailArgs>(
      getCustomerByEmail
    ),
    getCustomerById: resolverWrapper<QueryGetCustomerByIdArgs>(getCustomerById),
    getCustomerByIssuer: resolverWrapper<QueryGetCustomerByIssuerArgs>(
      getCustomerByIssuer
    ),
    getLatestBooking: resolverWrapper<QueryGetLatestBookingArgs>(
      getLatestBooking
    ),
    getNextAvailable: resolverWrapper<QueryGetNextAvailableArgs>(
      getNextAvailable
    ),
    getResourceById: resolverWrapper<QueryGetResourceByIdArgs>(getResourceById),
  },
  Mutation: {
    addBooking: resolverWrapper<MutationAddBookingArgs>(addBooking),
    addCustomer: resolverWrapper<MutationAddCustomerArgs>(addCustomer),
    addResource: resolverWrapper<MutationAddResourceArgs>(addResource),
    cancelBooking: resolverWrapper<MutationCancelBookingArgs>(cancelBooking),
    deleteCustomer: resolverWrapper<MutationDeleteCustomerArgs>(deleteCustomer),
    disableResource: resolverWrapper<MutationDisableResourceArgs>(
      disableResource
    ),
    setBookingComment: resolverWrapper<MutationSetBookingCommentArgs>(
      setBookingComment
    ),
    updateCustomer: resolverWrapper<MutationUpdateCustomerArgs>(updateCustomer),
    updateResource: resolverWrapper<MutationUpdateResourceArgs>(updateResource),
    disableCustomer: resolverWrapper<MutationDisableCustomerArgs>(
      disableCustomer
    ),
    addSigningKey: resolverWrapper<MutationAddSigningKeyArgs>(addSigningKey),
    deleteSigningKey: resolverWrapper<MutationDeleteSigningKeyArgs>(
      deleteSigningKey
    ),
  },
};
