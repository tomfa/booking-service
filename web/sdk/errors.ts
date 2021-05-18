/* eslint-disable max-classes-per-file */

export enum ErrorCode {
  INVALID_FILTER_OPTIONS = 'invalid_filter_options',
  RESOURCE_IS_DISABLED = 'resource_is_disabled',
  BOOKING_SLOT_IS_NOT_AVAILABLE = 'booking_slot_is_not_available',
  UNKNOWN_ERROR = 'unknown_error',
}

export class GenericBookingError extends Error {
  httpCode: number = 500;

  errorCode?: ErrorCode;

  constructor(message: string, errorCode = ErrorCode.UNKNOWN_ERROR) {
    super(message);
    this.errorCode = errorCode;
  }
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
