export function isValidBase64(value: any): boolean {
  if (typeof value !== 'string') {
    return false;
  }
  return Buffer.from(value, 'base64').toString('base64') === value;
}

export function decodeBase64(value: string): string {
  return Buffer.from(value, 'base64').toString('utf-8');
}

export function encodeBase64(value: string): string {
  return Buffer.from(value, 'utf-8').toString('base64');
}
