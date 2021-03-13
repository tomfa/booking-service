import * as express from 'express';
import * as bodyParser from 'body-parser';
import routes from './routes';

class App {
  public app: express.Application;
  constructor() {
    this.app = express();
    this.config();
  }
  private config() {
    this.app.use(bodyParser.json());
    this.app.use(routes);
  }
}

export default new App().app;
