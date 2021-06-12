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
import addCustomer from './addCustomer'
import disableCustomer from './disableCustomer'
import * as types from './types'
import updateCustomer from './updateCustomer';
import { Mutation, MutationType, QueryType } from './types';


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

exports.handler = async (event: AppSyncEvent) => {
  switch (event.info.fieldName) {
    case 'getResourceById': {
      console.log(`Executing getResourceById with ${event.arguments.id}`)
      return await getResourceById(event.arguments.id);
    }
    case 'getBookingById': {
      console.log(`Executing getBookingById with ${event.arguments.id}`)
      return await getBookingById(event.arguments.id);
    }
    case 'getCustomerByIssuer': {
      console.log(`Executing getCustomerByIssuer with ${event.arguments.issuer}`)
      return await getCustomerByIssuer(event.arguments.issuer);
    }
    case 'getCustomerByEmail': {
      console.log(`Executing getCustomerByEmail with ${event.arguments.email}`)
      return await getCustomerByEmail (event.arguments.email);
    }
    case 'getCustomerById': {
      console.log(`Executing getCustomerById with ${event.arguments.id}`)
      return await getCustomerById (event.arguments.id);
    }
    case 'findResources': {
      console.log(`Executing findResources with ${event.arguments.filterResource}`)
      return await findResources(event.arguments.filterResource);
    }
    case 'findBookings': {
      console.log(`Executing findBookings with ${event.arguments.filterBookings}`)
      return await findBookings(event.arguments.filterBookings);
    }
    case 'findAvailability': {
      console.log(`Executing findAvailability with ${event.arguments.filterAvailability}`)
      return await findAvailability(event.arguments.filterAvailability);
    }
    case 'getNextAvailable': {
      console.log(`Executing getNextAvailable with ${event.arguments.id}`)
      return await getNextAvailable(event.arguments.id);
    }
    case 'getLatestBooking': {
      console.log(`Executing getLatestBooking with ${event.arguments.filterBookings}`)
      return await getLatestBooking(event.arguments.filterBookings);
    }
    case 'getBookedDuration': {
      console.log(`Executing getBookedDuration with ${event.arguments.filterBookings}`)
      return await getBookedDuration(event.arguments.filterBookings);
    }
    case 'addResource': {
      console.log(`Executing addResource with ${event.arguments.addResourceInput}`)
      return await addResource(event.arguments.addResourceInput);
    }
    case 'updateResource': {
      console.log(`Executing updateResource with ${event.arguments.updateResourceInput}`)
      return await updateResource(event.arguments.updateResourceInput);
    }
    case 'updateCustomer': {
      console.log(`Executing updateCustomer with ${event.arguments.updateCustomerInput}`)
      return await updateCustomer(event.arguments.updateCustomerInput);
    }
    case 'addBooking': {
      console.log(`Executing addBooking with ${event.arguments.addBookingInput}`)
      return await addBooking(event.arguments.addBookingInput);
    }
    case 'disableResource': {
      console.log(`Executing disableResource with ${event.arguments.id}`)
      return await disableResource(event.arguments.id);
    }
    case 'cancelBooking': {
      console.log(`Executing cancelBooking with ${event.arguments.id}`)
      return await cancelBooking(event.arguments.id);
    }
    case 'addCustomer': {
      console.log(`Executing addCustomer with ${event.arguments.addCustomerInput}`)
      return await addCustomer(event.arguments.addCustomerInput)
    }
    case 'disableCustomer': {
      console.log(`Executing disableCustomer with ${event.arguments.i}`)
      return await disableCustomer(event.arguments.id)
    }
    default:
      return null;
  }
};
