import { IAPIError, ErrorContext } from './types';

export class APIError implements IAPIError {
  name = 'Internal Server Error';

  displayMessage = 'Something odd happened, sorry. We will look into it!';

  httpCode = 500;

  message: string;

  errors: string[];

  debugContext: ErrorContext;

  constructor(message: string | Error, context?: ErrorContext) {
    if (typeof message === 'string') {
      this.message = message;
    } else {
      this.message = message.message
    }
    this.errors = [this.displayMessage]
    this.debugContext = context
  }
}
