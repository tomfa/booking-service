import { Spinner } from '../components/Spinner';
import { Resource, TimeSlot } from '../graphql/generated/types';
import { useCallback, useEffect, useMemo } from 'react';
import { SeatSelectInput } from '../components/SeatSelectInput';
import { findContinouslyAvailableSeats } from '../utils/availability.utils';

type ResourceSelectorProps = {
  start: Date;
  end: Date;
  resource?: Resource | null;
  isLoading: boolean;
  slots?: TimeSlot[];
  selectedSeats: number[];
  setSelectedSeats: (seats: number[]) => void;
};

export const ResourceSeatSelector = (props: ResourceSelectorProps) => {
  const numSeats = props.resource?.seats || 0;
  const seats = useMemo(
    () =>
      Array(numSeats)
        .fill(undefined)
        .map((_, i) => i),
    [numSeats]
  );
  const availableSeats = useMemo(() => findContinouslyAvailableSeats(props), [
    props,
  ]);
  const isAvailable = useCallback(
    (seat: number) => availableSeats.includes(seat),
    [availableSeats]
  );
  useEffect(() => {
    const allowedSeatsToSelect = props.selectedSeats.filter(isAvailable);
    if (allowedSeatsToSelect.length !== props.selectedSeats.length) {
      props.setSelectedSeats(allowedSeatsToSelect);
    }
  }, [isAvailable, props, props.selectedSeats]);

  const onChangeChecked = useCallback(
    (checked: boolean, seat: number) => {
      if (!checked && props.selectedSeats.includes(seat)) {
        props.setSelectedSeats(props.selectedSeats.filter(s => s !== seat));
      } else if (checked && !props.selectedSeats.includes(seat)) {
        props.setSelectedSeats(props.selectedSeats.concat([seat]));
      }
    },
    [props]
  );

  if (!props.resource) {
    return <Spinner />;
  }

  return (
    <div style={{ marginBottom: '2rem' }}>
      {seats.map(seatNumber => (
        <SeatSelectInput
          key={seatNumber}
          seatNumber={seatNumber}
          available={isAvailable(seatNumber)}
          checked={props.selectedSeats.includes(seatNumber)}
          setChecked={checked => onChangeChecked(checked, seatNumber)}
          isLoading={props.isLoading}
        />
      ))}
    </div>
  );
};
