import { close } from '../localDb';

module.exports = async () => {
  // @ts-ignore
  await global.httpServer.close();
  await close();
};
