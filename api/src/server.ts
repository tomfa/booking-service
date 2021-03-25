import serverless from 'serverless-http';
import App from './app';
import router from './routes';

module.exports.handler = serverless(new App(router).app);
