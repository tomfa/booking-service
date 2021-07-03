import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as express from 'express';

admin.initializeApp();

const app = express();

app.get('/helloWorld', (request, response) => {
  functions.logger.info('Hello logs!', { structuredData: true });
  response.send('Hello from Tomas!');
});

export const api = functions.region('europe-central2').https.onRequest(app);
