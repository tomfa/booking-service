import { AddCustomerInput } from './types';
import { Tables } from './constants';
import db from './db';

const { v4: uuid } = require('uuid');

async function addCustomer({ id = uuid(), ...rest }: AddCustomerInput) {
  try {
    const query = `INSERT INTO ${Tables.Customer} (id, name, email, phone_number, issuer, credits, enabled) VALUES(:id, :name, :email, :phoneNumber, :issuer, :credits, :enabled)`;
    const customer = { ...rest, id };
    await db.query(query, customer);
    return customer;
  } catch (err) {
    console.log('Postgres error: ', err);
    return null;
  }
}

export default addCustomer;
