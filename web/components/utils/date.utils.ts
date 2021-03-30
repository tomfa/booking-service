export const isToday = (date: Date) => {
  return new Date().toLocaleDateString() === date.toLocaleDateString();
};

export const isYesterday = (date: Date) => {
  return (
    new Date(date.getTime() - 24 * 3600 * 1000).toLocaleDateString() ===
    date.toLocaleDateString()
  );
};

export const IsoToDisplayDateTime = (isoDate: string) => {
  if (isoDate === '') {
    return 'Just now';
  }
  const date = new Date(isoDate);
  const timeString = date.toLocaleTimeString().substr(0, 5);
  if (isToday(date)) {
    return `Today, ${timeString}`;
  }
  if (isYesterday(date)) {
    return `Yesterday, ${timeString}`;
  }
  return `${date.toLocaleDateString()}, ${timeString}`;
};
