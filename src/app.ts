import * as express from 'express';
import * as bodyParser from 'body-parser';
import routes from './routes';
import { errorMiddleware } from './utils/errorHandler';

class App {
  public app: express.Application;
  constructor() {
    this.app = express();
    this.config();
  }
  private config() {
    this.app.use(bodyParser.json());
    this.app.use(routes);
    this.app.use(errorMiddleware)
  }
}

export default new App().app;
