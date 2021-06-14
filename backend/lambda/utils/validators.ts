export function isIsoDateFormat(date: string) {
  return date.length === 10 && !Number.isNaN(new Date(date).getTime());
}
