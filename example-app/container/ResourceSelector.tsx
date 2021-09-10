import { Spinner } from '../components/Spinner';
import { Resource, TimeSlot } from '../graphql/generated/types';
import { useCallback, useMemo } from 'react';
import { SeatSelectInput } from '../components/SeatSelectInput';

type ResourceSelectorProps = {
  start: Date;
  end: Date;
  resource?: Resource;
  isLoading: boolean;
  slots?: TimeSlot[];
};

export const ResourceSelector = (props: ResourceSelectorProps) => {
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
    (seat: number) => availableSeats.includes(seat) || seat % 2 === 0,
    [availableSeats]
  );

  if (props.isLoading || !props.resource) {
    return <Spinner />;
  }

  return (
    <div style={{ marginBottom: '2rem' }}>
      {seats.map(seatNumber => (
        <SeatSelectInput
          key={seatNumber}
          seatNumber={seatNumber}
          available={isAvailable(seatNumber)}
        />
      ))}
    </div>
  );
};

const findContinouslyAvailableSeats = ({
  resource,
  slots,
  start,
  end,
}: ResourceSelectorProps): number[] => {
  return [];
};
