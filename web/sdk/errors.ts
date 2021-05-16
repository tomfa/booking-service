/* eslint-disable max-classes-per-file */

export class GenericBookingError extends Error {
  httpCode: number = 500;
}

export class ObjectDoesNotExist extends GenericBookingError {
  httpCode = 404;
}

export class BadRequestError extends GenericBookingError {
  httpCode = 400;
}

export class ConflictingObjectExists extends GenericBookingError {
  httpCode = 400;
}
