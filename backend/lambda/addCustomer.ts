const { v4: uuid } = require('uuid');

import { AddCustomerInput } from './types';
import { Tables } from './constants';
import db from './db';

async function addCustomer(customer: AddCustomerInput) {
  if (!customer.id) customer.id = uuid();
  const {
    id,
    name = '',
    email,
    phoneNumber = null,
    issuer = '',
    credits = 0,
    enabled = true,
  } = customer;
  try {
    const query = `INSERT INTO ${Tables.Customer} (id, name, email, phoneNumber, issuer, credits, enabled) VALUES(:id, :name, :email, :phoneNumber, :issuer, :credits, :enabled)`;
    await db.query(query, {
      id,
      name,
      email,
      phoneNumber,
      issuer,
      credits,
      enabled,
    });
    return customer;
  } catch (err) {
    console.log('Postgres error: ', err);
    return null;
  }
}

export default addCustomer;
