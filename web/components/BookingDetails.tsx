import React, { useCallback } from 'react';
import classNames from 'classnames';
import { Booking, useCancelBookingMutation } from '../graphql/generated/types';
import { displayDate, fromGQLDate } from '../utils/date.utils';
import { Link } from './Link';
import { DisplayError } from './DisplayError';

interface Props {
  booking: Booking;
}

const BookingDetails = ({ booking }: Props) => {
  const resource = booking.resource;
  const start = fromGQLDate(booking.start);
  const end = fromGQLDate(booking.end);
  const isInPast = start < new Date();
  const secondsDiff = booking.end - booking.start;
  const durationMinutes = Math.floor(secondsDiff / 60);
  const [
    cancelBooking,
    { error: cancelBookingError },
  ] = useCancelBookingMutation();
  const removeBooking = useCallback(
    () => cancelBooking({ variables: { id: booking.id } }),
    [cancelBooking]
  );

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 flex justify-between">
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900 flex">
            <span>
              Booking for user &apos;{booking.userId || 'unknown'}&apos;
            </span>
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            {displayDate(start, resource.timezone)}
          </p>
        </div>
        {!isInPast && !booking.canceled && (
          <div>
            <button
              onClick={removeBooking}
              className="inline-block py-2 px-3 bg-gray-100 text-sm hover:bg-gray-200 shadow-lg ml-auto ml-1 text-red-600">
              Cancel booking
            </button>
          </div>
        )}
      </div>
      {cancelBookingError && (
        <DisplayError>{cancelBookingError.message}</DisplayError>
      )}
      <div className="border-t border-gray-200">
        <dl>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">User</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 mb-3">
              {booking.userId || '-'}
            </dd>
          </div>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Resource</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 mb-3">
              <Link
                href={`/resources/${resource.id}`}
                className="text-sm text-blue-700 hover:underline">
                {resource.label} {resource.enabled ? '' : ' (disabled)'}
              </Link>
            </dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">
              Seat numbers booked
            </dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 mb-3">
              {booking.seatNumbers.map(s => `#${s + 1}`).join(', ')}
            </dd>
          </div>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">
              Booking status
            </dt>
            <dd
              className={classNames(
                'mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 mb-3',
                { 'text-red-500': booking.canceled }
              )}>
              {booking.canceled && 'Canceled'}
              {!booking.canceled && isInPast && 'Completed'}
              {!booking.canceled && !isInPast && 'Upcoming'}
            </dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Start</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 mb-3">
              {displayDate(start, resource.timezone)}
            </dd>
          </div>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">End</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 mb-3">
              {displayDate(end, resource.timezone)} ({durationMinutes} minutes)
            </dd>
          </div>
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">
              Booking comment
            </dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 mb-3">
              {booking.comment || '-'}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

export default BookingDetails;
