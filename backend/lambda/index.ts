// @ts-ignore
// eslint-disable-next-line import/no-unresolved
import { Context } from '@types/aws-lambda';
import { PrismaClient } from '@prisma/client/scripts/default-index';
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
import addCustomer from './functions/addCustomer';
import disableCustomer from './functions/disableCustomer';
import updateCustomer from './functions/updateCustomer';
import {
  ErrorReturnTypes,
  MutationType,
  QueryType,
  SuccessReturnTypes,
} from './types';
import { GenericBookingError } from './utils/errors';
import { getDB } from './db';

type AppSyncEvent = {
  info: {
    fieldName: QueryType | MutationType;
  };
  arguments: {
    booking: types.Booking;
    resource: types.Resource;
    customer: types.Customer;
    id: string;
    filterResource: types.FindResourceInput;
    filterBookings: types.FindBookingInput;
    filterAvailability: types.FindAvailabilityInput;
    addResourceInput: types.AddResourceInput;
    addBookingInput: types.AddBookingInput;
    addCustomerInput: types.AddCustomerInput;
    updateResourceInput: types.UpdateResourceInput;
    updateCustomerInput: types.UpdateCustomerInput;
    issuer: string;
    email: string;
  };
};

exports.handler = async (
  event: AppSyncEvent,
  context: Context,
  db?: PrismaClient
): Promise<ErrorReturnTypes | SuccessReturnTypes> => {
  if (!db) {
    // eslint-disable-next-line no-param-reassign
    db = await getDB();
  }
  // Set to false to send the response right away when the callback executes, instead of waiting for the Node.js event loop to be empty.
  context.callbackWaitsForEmptyEventLoop = false;
  const {
    arguments: args,
    info: { fieldName },
  } = event;

  // TODO: Check for authentication.
  //   - Then set or filter by customerId
  try {
    switch (fieldName) {
      case 'getResourceById': {
        console.log(
          `Executing getResourceById with ${JSON.stringify(args.id)}`
        );
        return await getResourceById(db, args.id);
      }
      case 'getBookingById': {
        console.log(`Executing getBookingById with ${JSON.stringify(args.id)}`);
        return await getBookingById(db, args.id);
      }
      case 'getCustomerByIssuer': {
        console.log(
          `Executing getCustomerByIssuer with ${JSON.stringify(args.issuer)}`
        );
        return await getCustomerByIssuer(db, args.issuer);
      }
      case 'getCustomerByEmail': {
        console.log(
          `Executing getCustomerByEmail with ${JSON.stringify(args.email)}`
        );
        return await getCustomerByEmail(db, args.email);
      }
      case 'getCustomerById': {
        console.log(
          `Executing getCustomerById with ${JSON.stringify(args.id)}`
        );
        return await getCustomerById(db, args.id);
      }
      case 'findResources': {
        console.log(
          `Executing findResources with ${JSON.stringify(args.filterResource)}`
        );
        return await findResources(db, args.filterResource);
      }
      case 'findBookings': {
        console.log(
          `Executing findBookings with ${JSON.stringify(args.filterBookings)}`
        );
        return await findBookings(db, args.filterBookings);
      }
      case 'findAvailability': {
        console.log(
          `Executing findAvailability with ${JSON.stringify(
            args.filterAvailability
          )}`
        );
        return await findAvailability(db, args.filterAvailability);
      }
      case 'getNextAvailable': {
        console.log(
          `Executing getNextAvailable with ${JSON.stringify(args.id)}`
        );
        return await getNextAvailable(db, args.id);
      }
      case 'getLatestBooking': {
        console.log(
          `Executing getLatestBooking with ${JSON.stringify(
            args.filterBookings
          )}`
        );
        return await getLatestBooking(db, args.filterBookings);
      }
      case 'getBookedDuration': {
        console.log(
          `Executing getBookedDuration with ${JSON.stringify(
            args.filterBookings
          )}`
        );
        return await getBookedDuration(db, args.filterBookings);
      }
      case 'addResource': {
        console.log(
          `Executing addResource with ${JSON.stringify(args.addResourceInput)}`
        );
        return await addResource(db, args.addResourceInput);
      }
      case 'updateResource': {
        console.log(
          `Executing updateResource with ${JSON.stringify(
            args.updateResourceInput
          )}`
        );
        return await updateResource(db, args.updateResourceInput);
      }
      case 'updateCustomer': {
        console.log(
          `Executing updateCustomer with ${JSON.stringify(
            args.updateCustomerInput
          )}`
        );
        return await updateCustomer(db, args.updateCustomerInput);
      }
      case 'addBooking': {
        console.log(
          `Executing addBooking with ${JSON.stringify(args.addBookingInput)}`
        );
        return await addBooking(db, args.addBookingInput);
      }
      case 'disableResource': {
        console.log(
          `Executing disableResource with ${JSON.stringify(args.id)}`
        );
        return await disableResource(db, args.id);
      }
      case 'cancelBooking': {
        console.log(`Executing cancelBooking with ${JSON.stringify(args.id)}`);
        return await cancelBooking(db, args.id);
      }
      case 'addCustomer': {
        console.log(
          `Executing addCustomer with ${JSON.stringify(args.addCustomerInput)}`
        );
        return await addCustomer(db, args.addCustomerInput);
      }
      case 'disableCustomer': {
        console.log(
          `Executing disableCustomer with ${JSON.stringify(args.id)}`
        );
        return await disableCustomer(db, args.id);
      }
      default:
        return new GenericBookingError(
          `Unhandled field ${fieldName}`
        ).toErrorType();
    }
  } catch (err) {
    if (err instanceof GenericBookingError) {
      return err.toErrorType();
    }
    // TODO: Clean error types not to leak anything possibly sensitive
    return new GenericBookingError(
      `Unknown error occured: ${err}`
    ).toErrorType();
  }
};
