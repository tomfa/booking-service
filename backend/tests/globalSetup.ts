import { getDB } from '../localDb';

const server = require('../local').default;

module.exports = async () => {
  const db = await getDB();
  // @ts-ignore
  global.httpServer = server;
};
