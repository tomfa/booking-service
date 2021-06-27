/* eslint-disable import/no-extraneous-dependencies, no-await-in-loop, no-console */
import fetch from 'node-fetch';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.test' });

const apiUrl = `http://${process.env.GRAPHQL_ENDPOINT}:${process.env.GRAPHQL_PORT}/graphql`;

const hasAPIStarted = async () => {
  try {
    await fetch(apiUrl, { timeout: 3000 });
    return true;
  } catch (err) {
    return false;
  }
};

const sleep = async (time: number) =>
  new Promise(resolve => setTimeout(resolve, time));

const awaitUntilAPIStarts = async () => {
  const maxWaitMs = 15000;
  const started = Date.now();
  let hasStarted = await hasAPIStarted();
  while (!hasStarted) {
    if (Date.now() - started > maxWaitMs) {
      console.log(
        `Waited more than ${maxWaitMs}ms for server to start. Aborting.`
      );
      return;
    }
    console.log(`Waiting for server to start at ${apiUrl}`);
    await sleep(3000);
    hasStarted = await hasAPIStarted();
  }
  if (!hasStarted) {
    throw new Error(`Unable to find running server at ${apiUrl} `);
  }
};

module.exports = async () => {
  await awaitUntilAPIStarts();
};
