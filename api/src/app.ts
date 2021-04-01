import express from 'express';
import cors from 'cors';
import * as bodyParser from 'body-parser';
import * as dotenv from 'dotenv';

import { errorMiddleware } from './utils/errorHandler';
import config from './config';
import { authMiddleware } from './utils/auth/middleware';

dotenv.config();

class App {
  public app: express.Application;

  constructor(router: express.Router) {
    this.app = express();
    this.setup(router);
  }

  private setup(router: express.Router) {
    this.app.use(cors({ origin: config.allowedOrigins }));
    this.app.use(bodyParser.json());
    this.app.use(router);
    this.app.use(authMiddleware);
    this.app.use(errorMiddleware);
  }
}

export default App;
