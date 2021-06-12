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
import deleteResource from './deleteResource'
import addCustomer from './addCustomer'
import disableCustomer from './disableCustomer'
import * as types from './types'


type AppSyncEvent = {
  info: {
    fieldName: string;
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
      return await getResourceById(event.arguments.id);
    }
    case 'getBookingById': {
      return await getBookingById(event.arguments.id);
    }
    case 'getCustomerByIssuer': {
      return await getCustomerByIssuer(event.arguments.issuer);
    }
    case 'getCustomerByEmail': {
      return await getCustomerByEmail (event.arguments.email);
    }
    case 'getCustomerById': {
      return await getCustomerById (event.arguments.id);
    }
    case 'findResources': {
      return await findResources(event.arguments.filterResource);
    }
    case 'findBookings': {
      return await findBookings(event.arguments.filterBookings);
    }
    case 'findAvailability': {
      return await findAvailability(event.arguments.filterAvailability);
    }
    case 'getNextAvailable': {
      return await getNextAvailable(event.arguments.id);
    }
    case 'getLatestBooking': {
      return await getLatestBooking(event.arguments.filterBookings);
    }
    case 'getBookedDuration': {
      return await getBookedDuration(event.arguments.filterBookings);
    }
    case 'addResource': {
      return await addResource(event.arguments.addResourceInput);
    }
    case 'updateResource': {
      return await updateResource(event.arguments.updateResourceInput);
    }
    case 'addBooking': {
      return await addBooking(event.arguments.addBookingInput);
    }
    case 'disableResource': {
      return await disableResource(event.arguments.id);
    }
    case 'cancelBooking': {
      return await cancelBooking(event.arguments.id);
    }
    case 'deleteResource': {
      await deleteResource(event.arguments.id)
    }
    case 'addCustomer': {
      await addCustomer(event.arguments.addCustomerInput)
    }
    case 'disableCustomer': {
      await disableCustomer(event.arguments.id)
    }
    default:
      return null;
  }
};
