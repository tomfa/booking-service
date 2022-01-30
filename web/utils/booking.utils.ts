export const displaySeats = (seats: number[] | number): string => {
  const prefix = Array.isArray(seats) && seats.length > 1 && `Seats ` || `Seat `
  if (Array.isArray(seats)) {
    return prefix + seats.map(s => s + 1).join(', ');
  }
  return prefix + (seats + 1)
};
