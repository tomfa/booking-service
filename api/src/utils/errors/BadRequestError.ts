import { APIError } from './APIError';
import { ErrorContext } from './types';

export type FieldError = {
  field: string;
  error: string;
};

export class BadRequestError extends APIError {
  displayMessage = 'Seems you passed on something wrong.';

  name = 'Bad Request';

  httpCode = 400;

  constructor(errors: FieldError | FieldError[], context?: ErrorContext) {
    super(BadRequestError.serializeFieldError(errors).join('. '), context);
    this.errors = BadRequestError.serializeFieldError(errors);
  }

  private static serializeFieldError(
    errors: FieldError | FieldError[]
  ): string[] {
    if (errors instanceof Array) {
      return errors.map(err => `${err.field}: ${err.error}`);
    }
    return [`${errors.field}: ${errors.error}`];
  }
}
