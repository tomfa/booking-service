import { APIError } from './APIError';
import { ErrorContext } from './types';

export class NotAuthenticatedError extends APIError {
  displayMessage = 'You need to log in first.';

  name = 'Not Authenticated';

  httpCode = 401;

  constructor(context?: ErrorContext) {
    super('Not Authenticated', context);
  }
}
