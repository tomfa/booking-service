import React from 'react';
import styles from './BookingConfirmation.module.scss';
import { AddBookingMutation } from '../graphql/generated/types';
import { displayDate, displayTime, fromGQLDate } from '../utils/date.utils';

type BookingConfirmationProps = {
  booking?: AddBookingMutation['addBooking'];
};
export const BookingConfirmation = ({ booking }: BookingConfirmationProps) => {
  if (!booking) {
    return null;
  }
  const start = fromGQLDate(booking.start);
  const end = fromGQLDate(booking.end);
  const isSameDate = displayDate(start) === displayDate(end);
  return (
    <div className={styles.container}>
      <p>
        Booking for sone {booking.seatNumbers.map(s => s + 1).join(', ')}{' '}
        bekreftet{' '}
        <span>
          {displayDate(start)} kl. {displayTime(start)}
        </span>{' '}
        til {!isSameDate && displayDate(end)} kl. {displayTime(end)}.
      </p>
      <small className={styles.reference}>booking-id: {booking.id}</small>
    </div>
  );
};
