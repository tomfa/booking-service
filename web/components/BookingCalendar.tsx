import Link from 'next/link';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import { useRouter } from 'next/router';
import {
  Resource,
  TimeSlot,
  useAddBookingMutation,
} from '../graphql/generated/types';
import { displaySeats } from '../utils/booking.utils';
import { DisplayError } from './DisplayError';
import { SuccessMessage } from './SuccessMessage';

const formatGQLTime = (time: number) =>
  new Date(time * 1000).toISOString().substring(10, 16).replace('T', ' ');
const gQLTimeToDateString = (time: number) =>
  new Date(time * 1000).toISOString().substring(0, 10);

const BookableTimeSlot = ({
  timeslot,
  onSelect,
}: {
  timeslot: TimeSlot;
  onSelect: () => void;
}) => {
  const startTime = formatGQLTime(timeslot.start);
  const endTime = formatGQLTime(timeslot.end);
  if (timeslot.availableSeats <= 0) {
    return (
      <option disabled>
        {startTime} - {endTime} (opptatt)
      </option>
    );
  }
  return (
    <option onSelect={onSelect}>
      {startTime} - {endTime}
    </option>
  );
};

const BookingCalendar = ({
  availability,
  resource,
}: {
  availability: TimeSlot[];
  resource: Resource;
}) => {
  const router = useRouter();
  const [addBookingMutation, bookingResult] = useAddBookingMutation();
  const [userId, setUserId] = useState<string>();
  const [timeSlot, setTimeSlot] = useState<TimeSlot>();
  const [comment, setComment] = useState<string>();
  const [seatNumbers, setSeatNumbers] = useState<number[]>();
  const [selectedDay, setSelectedDay] = useState<string | undefined>(() =>
    availability.length ? gQLTimeToDateString(availability[0].start) : undefined
  );
  const days = useMemo(() => {
    const d: Record<string, TimeSlot[]> = {};
    availability.forEach(t => {
      const dateStr = gQLTimeToDateString(t.start);
      if (!d[dateStr]) {
        d[dateStr] = [];
      }
      d[dateStr].push(t);
    });
    return d;
  }, [availability]);
  const selectableDays = useMemo(() => Object.keys(days), [days]);
  const slots = useMemo(() => (selectedDay && days[selectedDay]) || [], [
    selectedDay,
  ]);
  useEffect(() => {
    if (timeSlot || !slots.length) {
      return;
    }
    setTimeSlot(slots[0]);
  }, [slots, timeSlot]);

  const addBooking = useCallback(() => {
    if (!timeSlot) {
      return;
    }
    const variables = {
      addBookingInput: {
        resourceId: resource.id,
        start: timeSlot.start,
        userId,
        comment,
        seatNumbers,
      },
    };
    addBookingMutation({
      variables,
    });
  }, [timeSlot, resource.id, userId, comment, seatNumbers, addBookingMutation]);
  if (bookingResult.loading) {
    return (
      <div className="rounded-md p-4">
        <p className="flex ml-3 text-sm">Laster...</p>
      </div>
    );
  }

  if (bookingResult.data?.addBooking) {
    const booking = bookingResult.data.addBooking;
    return (
      <div>
        <SuccessMessage>
          <span className={'db'}>
            {displaySeats(booking.seatNumbers)} booked{' '}
            {gQLTimeToDateString(booking.start)} at{' '}
            {formatGQLTime(booking.start)} for {booking.userId}{' '}
          </span>
          <ul className={'mt-4'}>
            <li>
              {' '}
              <Link href={`/bookings/${booking.id}`} passHref>
                <a className={'underline hover:no-underline db'} href={'/'}>
                  View booking
                </a>
              </Link>
            </li>
            <li>
              {' '}
              <button
                onClick={() => {
                  router.reload();
                }}
                className={'underline hover:no-underline'}>
                Add another booking
              </button>
            </li>
          </ul>
        </SuccessMessage>
      </div>
    );
  }
  return (
    <div className="mt-5 md:mt-0 md:col-span-2">
      {bookingResult.error && (
        <DisplayError>{bookingResult.error?.message}</DisplayError>
      )}
      <form action="#" method="POST">
        <div className="shadow overflow-hidden sm:rounded-md">
          <div className="px-4 py-5 bg-white sm:p-6">
            <div className="grid grid-cols-6 gap-6 mb-6">
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="first-name"
                  className="block text-sm font-medium text-gray-700">
                  User id (optional)
                </label>
                <input
                  type="text"
                  name="first-name"
                  id="first-name"
                  autoComplete="given-name"
                  onChange={e => setUserId(e.target.value)}
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
                <span className={'mt-1 text-gray-500 text-sm'}>
                  Specify userId if you want to book on behalf of another user.
                </span>
              </div>
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="city"
                  className="block text-sm font-medium text-gray-700">
                  Seat numbers (optional)
                </label>
                <input
                  type="text"
                  name="city"
                  id="city"
                  defaultValue={seatNumbers?.join(',')}
                  onChange={e =>
                    setSeatNumbers(
                      e.target.value
                        .split(',')
                        .map(s => Number.parseInt(s.trim()))
                        .filter(n => !Number.isNaN(n))
                    )
                  }
                  autoComplete="address-level2"
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                />
                <span className={'mt-1 text-gray-500 text-sm'}>
                  Select specific seat here. Book multiple seats by separating
                  them with comma. Valid inputs: 1-{resource.seats}
                </span>
              </div>
            </div>
            <div className="grid grid-cols-6 gap-6">
              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="country"
                  className="block text-sm font-medium text-gray-700">
                  Day
                </label>
                <select
                  id="country"
                  name="country"
                  autoComplete="country-name"
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                  {selectableDays.map(s => (
                    <option key={s} onSelect={() => setSelectedDay(s)}>
                      {s}
                    </option>
                  ))}
                </select>
                <span className={'mt-1 text-gray-500 text-sm'}>
                  Days only shown for the next 3 weeks
                </span>
              </div>

              <div className="col-span-6 sm:col-span-3">
                <label
                  htmlFor="country"
                  className="block text-sm font-medium text-gray-700">
                  Time of day
                </label>
                <select
                  id="country"
                  name="country"
                  autoComplete="country-name"
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                  {slots.map(s => (
                    <BookableTimeSlot
                      timeslot={s}
                      key={s.start}
                      onSelect={() => setTimeSlot(s)}
                    />
                  ))}
                </select>
              </div>

              <div className="col-span-6">
                <label
                  htmlFor="email-address"
                  className="block text-sm font-medium text-gray-700">
                  Comment
                </label>
                <textarea
                  autoComplete="email"
                  className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                  onChange={e => {
                    setComment(e.target.value);
                  }}
                />
              </div>
            </div>
          </div>
          <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
            <button
              type="button"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={addBooking}>
              Add booking
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default BookingCalendar;
