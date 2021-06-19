// @ts-ignore
// eslint-disable-next-line import/no-unresolved
import { Context } from '@types/aws-lambda';
import * as types from '../graphql/generated/types';
import { Query, Mutation } from '../graphql/generated/types';
import getResourceById from './getResourceById';
import getBookingById from './getBookingById';
import getCustomerByIssuer from './getCustomerByIssuer';
import getCustomerById from './getCustomerById';
import getCustomerByEmail from './getCustomerByEmail';
import findResources from './findResources';
import findBookings from './findBookings';
import findAvailability from './findAvailability';
import getNextAvailable from './getNextAvailable';
import getLatestBooking from './getLatestBooking';
import getBookedDuration from './getBookedDuration';
import addResource from './addResource';
import updateResource from './updateResource';
import addBooking from './addBooking';
import disableResource from './disableResource';
import cancelBooking from './cancelBooking';
import addCustomer from './addCustomer';
import disableCustomer from './disableCustomer';
import updateCustomer from './updateCustomer';
import { ErrorReturnTypes, SuccessReturnTypes } from './types';
import { GenericBookingError } from './utils/errors';

type QueryType = keyof Query;
type MutationType = keyof Mutation;

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
  context: Context
): Promise<ErrorReturnTypes | SuccessReturnTypes> => {
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
        console.log(`Executing getResourceById with ${args.id}`);
        return await getResourceById(args.id);
      }
      case 'getBookingById': {
        console.log(`Executing getBookingById with ${args.id}`);
        return await getBookingById(args.id);
      }
      case 'getCustomerByIssuer': {
        console.log(`Executing getCustomerByIssuer with ${args.issuer}`);
        return await getCustomerByIssuer(args.issuer);
      }
      case 'getCustomerByEmail': {
        console.log(`Executing getCustomerByEmail with ${args.email}`);
        return await getCustomerByEmail(args.email);
      }
      case 'getCustomerById': {
        console.log(`Executing getCustomerById with ${args.id}`);
        return await getCustomerById(args.id);
      }
      case 'findResources': {
        console.log(
          `Executing findResources with ${JSON.stringify(args.filterResource)}`
        );
        return await findResources(args.filterResource);
      }
      case 'findBookings': {
        console.log(`Executing findBookings with ${args.filterBookings}`);
        return await findBookings(args.filterBookings);
      }
      case 'findAvailability': {
        console.log(
          `Executing findAvailability with ${args.filterAvailability}`
        );
        return await findAvailability(args.filterAvailability);
      }
      case 'getNextAvailable': {
        console.log(`Executing getNextAvailable with ${args.id}`);
        return await getNextAvailable(args.id);
      }
      case 'getLatestBooking': {
        console.log(`Executing getLatestBooking with ${args.filterBookings}`);
        return await getLatestBooking(args.filterBookings);
      }
      case 'getBookedDuration': {
        console.log(`Executing getBookedDuration with ${args.filterBookings}`);
        return await getBookedDuration(args.filterBookings);
      }
      case 'addResource': {
        console.log(`Executing addResource with ${args.addResourceInput}`);
        return await addResource(args.addResourceInput);
      }
      case 'updateResource': {
        console.log(
          `Executing updateResource with ${args.updateResourceInput}`
        );
        return await updateResource(args.updateResourceInput);
      }
      case 'updateCustomer': {
        console.log(
          `Executing updateCustomer with ${args.updateCustomerInput}`
        );
        return await updateCustomer(args.updateCustomerInput);
      }
      case 'addBooking': {
        console.log(`Executing addBooking with ${args.addBookingInput}`);
        return await addBooking(args.addBookingInput);
      }
      case 'disableResource': {
        console.log(`Executing disableResource with ${args.id}`);
        return await disableResource(args.id);
      }
      case 'cancelBooking': {
        console.log(`Executing cancelBooking with ${args.id}`);
        return await cancelBooking(args.id);
      }
      case 'addCustomer': {
        console.log(`Executing addCustomer with ${args.addCustomerInput}`);
        return await addCustomer(args.addCustomerInput);
      }
      case 'disableCustomer': {
        console.log(`Executing disableCustomer with ${args.id}`);
        return await disableCustomer(args.id);
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
