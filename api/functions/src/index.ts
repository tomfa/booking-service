import * as functions from 'firebase-functions';
import app from './app';

export { createUserRecord } from './auth';

export const api = functions.region('europe-central2').https.onRequest(app);
