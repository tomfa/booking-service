import serverless from 'serverless-http';
import App from './app';
import generatorRoutes from './generatorRoutes';

module.exports.handler = serverless(new App(generatorRoutes).app);
