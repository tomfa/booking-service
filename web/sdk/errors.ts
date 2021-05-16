/* eslint-disable max-classes-per-file */

export class GenericBookingError extends Error {
  httpCode: number = 500;
}

export class ResourceDoesNotExist extends GenericBookingError {
  httpCode = 404;
}

export class BadRequestError extends GenericBookingError {
  httpCode = 400;
}

export class ConflictingResourceExists extends GenericBookingError {
  httpCode = 400;
}
