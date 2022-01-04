import React from 'react';
import Link from 'next/link';
import { Booking } from '../graphql/generated/types';
import { displayDate, fromGQLDate } from '../utils/date.utils';

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

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 flex justify-between">
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900 flex">
            <span>
              Booking for {resource.label} by {booking.userId || 'unknown'}
            </span>
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            id: {booking.id}
          </p>
        </div>
        {/* {!isInPast && (
          <div>
            <Link href={`/resources/${resource.id}/edit`} passHref>
              <a
                href={'/'}
                className="inline-block py-2 px-3 bg-gray-100 text-sm hover:bg-gray-200 shadow-lg ml-auto ml-1">
                Cancel booking
              </a>
            </Link>
          </div>
        )} */}
      </div>
      <div className="border-t border-gray-200">
        <dl>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Resource</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 mb-3">
              <Link href={`/resources/${resource.id}`} passHref>
                <a href={'/'} className="text-sm text-blue-700 hover:underline">
                  {resource.label} {resource.enabled ? '' : ' (disabled)'}
                </a>
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
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 mb-3">
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

          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">User</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 mb-3">
              {booking.userId || '-'}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

export default BookingDetails;
