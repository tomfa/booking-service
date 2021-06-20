import createApp from '../app';

module.exports = () => {
  const server = createApp();

  // @ts-ignore
  global.httpServer = server;
};
