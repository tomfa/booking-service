/* eslint-disable max-classes-per-file */

export class GenericBookingError extends Error {
  httpCode: number;

  constructor(httpStatus: number, message?: string) {
    super(message);
    this.httpCode = httpStatus;
  }
}

export class ResourceDoesNotExist extends GenericBookingError {
  constructor(message?: string) {
    super(404, message);
  }
}

export class ConflictingResourceExists extends GenericBookingError {
  constructor(message?: string) {
    super(400, message);
  }
}
