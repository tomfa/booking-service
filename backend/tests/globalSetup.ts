import createApp from '../app';

module.exports = async () => {
  const server = await createApp();

  // @ts-ignore
  global.httpServer = server;
};
