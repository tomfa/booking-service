import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as dotenv from 'dotenv';

dotenv.config()

import routes from './routes';
import { errorMiddleware } from './utils/errorHandler';
import config, { Config } from './config';


class App {
  public app: express.Application;
  private config: Config;
  constructor() {
    this.app = express();
    this.setup();
    this.config = config;
  }
  private setup() {
    this.app.use(bodyParser.json());
    this.app.use(routes);
    this.app.use(errorMiddleware)
  }
}

export default new App().app;
