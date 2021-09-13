import React, { useCallback } from 'react';
import styles from './BookingConfirmation.module.scss';
import {
  AddBookingMutation,
  useCancelBookingMutation,
} from '../graphql/generated/types';
import { displayDate, displayTime, fromGQLDate } from '../utils/date.utils';
import { Button } from './Button';
import { DisplayError } from './DisplayError';

type BookingConfirmationProps = {
  booking?: AddBookingMutation['addBooking'];
  updateAvailability: () => void;
};
export const BookingConfirmation = ({
  booking,
  updateAvailability,
}: BookingConfirmationProps) => {
  const [
    cancelBooking,
    {
      data: cancelBookingData,
      loading: cancelBookingLoading,
      error: cancelBookingError,
    },
  ] = useCancelBookingMutation();

  const onCancelClick = useCallback(() => {
    if (cancelBookingLoading || !booking) {
      return;
    }
    cancelBooking({ variables: { id: booking.id } })
      .catch(() => {
        // Handled by errorhandler
      })
      .then(updateAvailability);
  }, [cancelBookingLoading, cancelBooking, booking, updateAvailability]);

  if (!booking) {
    return null;
  }

  const start = fromGQLDate(booking.start);
  const end = fromGQLDate(booking.end);
  const isSameDate = displayDate(start) === displayDate(end);
  const bookingHasBeenCanceled =
    booking && cancelBookingData?.cancelBooking?.id === booking.id;

  if (bookingHasBeenCanceled) {
    return null;
  }

  return (
    <div className={styles.container}>
      <p>
        Booking for sone {booking.seatNumbers.map(s => s + 1).join(', ')} <br />
        <span>
          {displayDate(start)} kl. {displayTime(start)}
        </span>{' '}
        til {!isSameDate && displayDate(end)} kl. {displayTime(end)}.
      </p>
      <small className={styles.reference}>
        booking-referanse: {booking.id}
      </small>
      {!bookingHasBeenCanceled && (
        <Button disabled={cancelBookingLoading} onClick={onCancelClick} small>
          {(cancelBookingLoading && '...') || 'Kanseller booking'}
        </Button>
      )}
      {!!cancelBookingError && (
        <DisplayError>{cancelBookingError.message}</DisplayError>
      )}
    </div>
  );
};
