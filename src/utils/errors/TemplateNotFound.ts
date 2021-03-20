import { APIError } from './APIError';

export class TemplateNotFound extends APIError {
  name = 'TemplateNotFound';

  displayMessage = 'Specified template was not found';

  httpCode = 404;
}
