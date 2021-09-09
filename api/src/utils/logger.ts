const debug = (message?: unknown, ...optionalParams: unknown[]): void => {
  console.log('DEBUG:', message, ...optionalParams);
};
const log = (message?: unknown, ...optionalParams: unknown[]): void => {
  console.log(message, ...optionalParams);
};
const warn = (message?: unknown, ...optionalParams: unknown[]): void => {
  console.log('WARN:', message, ...optionalParams);
};
const error = (message?: unknown, ...optionalParams: unknown[]): void => {
  console.log('ERROR:', message, ...optionalParams);
};

const logger = {
  debug,
  log,
  warn,
  error,
};

export default logger;
