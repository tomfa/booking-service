export function isValidBase64(value: any): boolean {
  if (typeof value !== 'string') {
    return false;
  }
  return encodeBase64(decodeBase64(value)) === value;
}

export function decodeBase64(value: string): string {
  const base64Value = value.replace(/-/g, '/').replace(/_/g, '+');
  return Buffer.from(base64Value, 'base64').toString('utf-8');
}

export function encodeBase64(value: string): string {
  const base64 = Buffer.from(value, 'utf-8').toString('base64');
  const urlSafeBase64 = base64.replace(/\//g, '-').replace(/\+/g, '_');
  return urlSafeBase64;
}
