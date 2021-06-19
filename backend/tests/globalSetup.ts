const server = require('../local').default;

module.exports = async () => {
  // @ts-ignore
  global.httpServer = server;
};
