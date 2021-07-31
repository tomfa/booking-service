const fs = require('fs');
const path = require('path');

module.exports.getResourceById = fs.readFileSync(path.join(__dirname, 'getResourceById.gql'), 'utf8');
module.exports.getBookingById = fs.readFileSync(path.join(__dirname, 'getBookingById.gql'), 'utf8');
module.exports.getCustomerByIssuer = fs.readFileSync(path.join(__dirname, 'getCustomerByIssuer.gql'), 'utf8');
module.exports.getCustomerByEmail = fs.readFileSync(path.join(__dirname, 'getCustomerByEmail.gql'), 'utf8');
module.exports.getCustomerById = fs.readFileSync(path.join(__dirname, 'getCustomerById.gql'), 'utf8');
module.exports.findResources = fs.readFileSync(path.join(__dirname, 'findResources.gql'), 'utf8');
module.exports.findBookings = fs.readFileSync(path.join(__dirname, 'findBookings.gql'), 'utf8');
module.exports.findAvailability = fs.readFileSync(path.join(__dirname, 'findAvailability.gql'), 'utf8');
module.exports.getNextAvailable = fs.readFileSync(path.join(__dirname, 'getNextAvailable.gql'), 'utf8');
module.exports.getLatestBooking = fs.readFileSync(path.join(__dirname, 'getLatestBooking.gql'), 'utf8');
module.exports.getBookedDuration = fs.readFileSync(path.join(__dirname, 'getBookedDuration.gql'), 'utf8');
