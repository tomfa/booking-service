// @ts-ignore
// eslint-disable-next-line import/no-unresolved
import { Context, AppSyncResolverEvent, Callback } from '@types/aws-lambda';
import { PrismaClient } from '@prisma/client';
import * as types from '../graphql/generated/types';
import getResourceById from './functions/getResourceById';
import getBookingById from './functions/getBookingById';
import getCustomerByIssuer from './functions/getCustomerByIssuer';
import getCustomerById from './functions/getCustomerById';
import getCustomerByEmail from './functions/getCustomerByEmail';
import findResources from './functions/findResources';
import findBookings from './functions/findBookings';
import findAvailability from './functions/findAvailability';
import getNextAvailable from './functions/getNextAvailable';
import getLatestBooking from './functions/getLatestBooking';
import getBookedDuration from './functions/getBookedDuration';
import addResource from './functions/addResource';
import updateResource from './functions/updateResource';
import addBooking from './functions/addBooking';
import disableResource from './functions/disableResource';
import cancelBooking from './functions/cancelBooking';
import setBookingComment from './functions/setBookingComment';
import addCustomer from './functions/addCustomer';
import disableCustomer from './functions/disableCustomer';
import deleteCustomer from './functions/deleteCustomer';
import updateCustomer from './functions/updateCustomer';
import { MutationType, QueryType, SuccessReturnTypes } from './types';
import { GenericBookingError } from './utils/errors';
import { getDB } from './db';
import { getVerifiedTokenData } from './auth/jwt';

type ArgumentType = {
  booking: types.Booking;
  resource: types.Resource;
  customer: types.Customer;
  id: string;
  afterDate: number;
  filterResource: types.FindResourceInput;
  filterBookings: types.FindBookingInput;
  filterAvailability: types.FindAvailabilityInput;
  addResourceInput: types.AddResourceInput;
  addBookingInput: types.AddBookingInput;
  addCustomerInput: types.AddCustomerInput;
  updateResourceInput: types.UpdateResourceInput;
  updateCustomerInput: types.UpdateCustomerInput;
  comment: string;
  issuer: string;
  email: string;
};
type AppSyncEvent = AppSyncResolverEvent<ArgumentType>;

exports.handler = async (
  event: AppSyncEvent,
  context: Context,
  callback: Callback,
  db?: PrismaClient
) => {
  // Set to false to send the response right away when the callback executes, instead of waiting for the Node.js event loop to be empty.
  context.callbackWaitsForEmptyEventLoop = false;

  if (!db) {
    // eslint-disable-next-line no-param-reassign
    db = await getDB();
  }

  try {
    const response = handleEvent(
      db,
      event.info.fieldName as MutationType | QueryType,
      event.arguments,
      event.request.headers['x-authorization']
    );
    callback(
      null,
      JSON.stringify({
        body: response,
        statusCode: 200,
        headers: { 'Access-Control-Allow-Origin': '*' },
      })
    );
  } catch (err) {
    callback(
      err,
      JSON.stringify({
        body: null,
        statusCode: err.httpCode || 500,
        headers: { 'Access-Control-Allow-Origin': '*' },
      })
    );
  }
};

const handleEvent = async (
  db: PrismaClient,
  fieldName: MutationType | QueryType,
  args: ArgumentType,
  authHeader?: string
): Promise<SuccessReturnTypes> => {
  const token = await getVerifiedTokenData(authHeader, db);

  switch (fieldName) {
    case 'getResourceById': {
      console.log(`Executing getResourceById with ${JSON.stringify(args.id)}`);
      return await getResourceById(db, args.id, token);
    }
    case 'getBookingById': {
      console.log(`Executing getBookingById with ${JSON.stringify(args.id)}`);
      return await getBookingById(db, args.id, token);
    }
    case 'getCustomerByIssuer': {
      console.log(
        `Executing getCustomerByIssuer with ${JSON.stringify(args.issuer)}`
      );
      return await getCustomerByIssuer(db, args.issuer, token);
    }
    case 'getCustomerByEmail': {
      console.log(
        `Executing getCustomerByEmail with ${JSON.stringify(args.email)}`
      );
      return await getCustomerByEmail(db, args.email, token);
    }
    case 'getCustomerById': {
      console.log(`Executing getCustomerById with ${JSON.stringify(args.id)}`);
      return await getCustomerById(db, args.id, token);
    }
    case 'findResources': {
      console.log(
        `Executing findResources with ${JSON.stringify(args.filterResource)}`
      );
      return await findResources(db, args.filterResource, token);
    }
    case 'findBookings': {
      console.log(
        `Executing findBookings with ${JSON.stringify(args.filterBookings)}`
      );
      return await findBookings(db, args.filterBookings, token);
    }
    case 'findAvailability': {
      console.log(
        `Executing findAvailability with ${JSON.stringify(
          args.filterAvailability
        )}`
      );
      return await findAvailability(db, args.filterAvailability, token);
    }
    case 'getNextAvailable': {
      console.log(`Executing getNextAvailable with ${JSON.stringify(args.id)}`);
      return await getNextAvailable(db, args.id, args.afterDate, token);
    }
    case 'getLatestBooking': {
      console.log(
        `Executing getLatestBooking with ${JSON.stringify(args.filterBookings)}`
      );
      return await getLatestBooking(db, args.filterBookings, token);
    }
    case 'getBookedDuration': {
      console.log(
        `Executing getBookedDuration with ${JSON.stringify(
          args.filterBookings
        )}`
      );
      return await getBookedDuration(db, args.filterBookings, token);
    }
    case 'addResource': {
      console.log(
        `Executing addResource with ${JSON.stringify(args.addResourceInput)}`
      );
      return await addResource(db, args.addResourceInput, token);
    }
    case 'updateResource': {
      console.log(
        `Executing updateResource with ${JSON.stringify(
          args.updateResourceInput
        )}`
      );
      return await updateResource(db, args.updateResourceInput, token);
    }
    case 'updateCustomer': {
      console.log(
        `Executing updateCustomer with ${JSON.stringify(
          args.updateCustomerInput
        )}`
      );
      return await updateCustomer(db, args.updateCustomerInput, token);
    }
    case 'addBooking': {
      console.log(
        `Executing addBooking with ${JSON.stringify(args.addBookingInput)}`
      );
      return await addBooking(db, args.addBookingInput, token);
    }
    case 'disableResource': {
      console.log(`Executing disableResource with ${JSON.stringify(args.id)}`);
      return await disableResource(db, args.id, token);
    }
    case 'cancelBooking': {
      console.log(`Executing cancelBooking with ${JSON.stringify(args.id)}`);
      return await cancelBooking(db, args.id, token);
    }
    case 'setBookingComment': {
      console.log(`Executing setBookingComment with ${JSON.stringify(args)}`);
      return await setBookingComment(db, args.id, args.comment, token);
    }
    case 'addCustomer': {
      console.log(
        `Executing addCustomer with ${JSON.stringify(args.addCustomerInput)}`
      );
      return await addCustomer(db, args.addCustomerInput, token);
    }
    case 'disableCustomer': {
      console.log(`Executing disableCustomer with ${JSON.stringify(args.id)}`);
      return await disableCustomer(db, args.id, token);
    }
    case 'deleteCustomer': {
      console.log(`Executing deleteCustomer with ${JSON.stringify(args.id)}`);
      return await deleteCustomer(db, args.id, token);
    }
    default:
      throw new GenericBookingError(`Unhandled field ${fieldName}`);
  }
};
