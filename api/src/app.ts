import express from 'express';
import * as bodyParser from 'body-parser';
import * as dotenv from 'dotenv';

import { errorMiddleware } from './utils/errorHandler';
import config, { Config } from './config';
import { authMiddleware } from './utils/auth/middleware';

dotenv.config();

class App {
  public app: express.Application;

  private config: Config;

  constructor(router: express.Router) {
    this.app = express();
    this.setup(router);
    this.config = config;
  }

  private setup(router: express.Router) {
    this.app.use(bodyParser.json());
    this.app.use(router);
    this.app.use(errorMiddleware);
    this.app.use(authMiddleware);
  }
}

export default App;
