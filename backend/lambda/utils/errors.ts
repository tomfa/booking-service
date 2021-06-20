/* eslint-disable max-classes-per-file, no-useless-constructor */

// TODO: Merge with existing errors in sdk package

import { ErrorType } from './types';

export enum ErrorCode {
  BOOKING_DOES_NOT_EXIST = 'booking_does_not_exist',
  RESOURCE_DOES_NOT_EXIST = 'resource_does_not_exist',
  RESOURCE_IS_DISABLED = 'resource_is_disabled',
  CONFLICTS_WITH_EXISTING_RESOURCE = 'conflicts_with_existing_resource',
  INVALID_BOOKING_ARGUMENTS = 'invalid_booking_arguments',
  INVALID_CUSTOMER_ARGUMENTS = 'invalid_customer_arguments',
  BOOKING_SLOT_IS_NOT_AVAILABLE = 'booking_slot_is_not_available',
  INVALID_TIMESTAMP = 'invalid_timestamp',
  UNKNOWN_ERROR = 'unknown_error',
}

export class GenericBookingError extends Error {
  httpCode: number = 500;
  errorCode: string;

  constructor(
    message: string,
    errorCode: ErrorCode | string = ErrorCode.UNKNOWN_ERROR
  ) {
    super(message);
    this.errorCode = errorCode;
  }

  toErrorType(): ErrorType {
    return {
      error: this.message,
      type: String(this.errorCode),
      code: this.httpCode,
    };
  }
}

export class ObjectDoesNotExist extends GenericBookingError {
  httpCode = 404;

  constructor(message: string, errorCode: ErrorCode) {
    super(message, errorCode);
  }
}

export class BadRequestError extends GenericBookingError {
  httpCode = 400;

  constructor(message: string, errorCode: ErrorCode) {
    super(message, errorCode);
  }
}

export class ConflictingObjectExists extends GenericBookingError {
  httpCode = 400;

  constructor(message: string, errorCode: ErrorCode) {
    super(message, errorCode);
  }
}
