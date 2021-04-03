export const decode = (base64: string): string => {
  return Buffer.from(base64, 'base64').toString('utf-8');
};

export const encode = (data: string): string => {
  return Buffer.from(data, 'utf-8').toString('base64');
};

export function isValidUrlSafeBase64(value: any): boolean {
  if (typeof value !== 'string') {
    return false;
  }
  return encodeUrlSafeBase64(decodeUrlSafeBase64(value)) === value;
}

export function decodeUrlSafeBase64(value: string): string {
  const base64Value = value.replace(/-/g, '/').replace(/_/g, '+');
  return decode(base64Value);
}

export function encodeUrlSafeBase64(value: string): string {
  const base64Value = encode(value);
  return base64Value.replace(/\//g, '-').replace(/\+/g, '_');
}
