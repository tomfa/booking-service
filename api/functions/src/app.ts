import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as express from 'express';
import * as cors from 'cors';

admin.initializeApp();

const app = express();

app.use(cors({ origin: true }));

app.get('/helloWorld', (request, response) => {
  functions.logger.info('Hello logs!', { structuredData: true });
  response.send('Hello from Tomas!');
});

export default app;
