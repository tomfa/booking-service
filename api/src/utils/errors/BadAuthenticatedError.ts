import { APIError } from './APIError';
import { ErrorContext } from './types';

export class BadAuthenticationError extends APIError {
  displayMessage = 'Wrong username or password';

  name = 'Bad Authentication';

  httpCode = 401;

  constructor(context?: ErrorContext) {
    super('Wrong username or password', context);
  }
}
