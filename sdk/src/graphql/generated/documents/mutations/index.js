const fs = require('fs');
const path = require('path');

module.exports.addResource = fs.readFileSync(path.join(__dirname, 'addResource.gql'), 'utf8');
module.exports.updateResource = fs.readFileSync(path.join(__dirname, 'updateResource.gql'), 'utf8');
module.exports.updateCustomer = fs.readFileSync(path.join(__dirname, 'updateCustomer.gql'), 'utf8');
module.exports.addBooking = fs.readFileSync(path.join(__dirname, 'addBooking.gql'), 'utf8');
module.exports.disableResource = fs.readFileSync(path.join(__dirname, 'disableResource.gql'), 'utf8');
module.exports.cancelBooking = fs.readFileSync(path.join(__dirname, 'cancelBooking.gql'), 'utf8');
module.exports.addCustomer = fs.readFileSync(path.join(__dirname, 'addCustomer.gql'), 'utf8');
module.exports.disableCustomer = fs.readFileSync(path.join(__dirname, 'disableCustomer.gql'), 'utf8');
