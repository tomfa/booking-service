let store: Record<string, { expires: number; value: unknown }> = {};

function get<T = any>(key: string): T | undefined {
  const cacheValue = store[key];
  if (cacheValue === undefined) {
    return undefined;
  }
  const hasExpired = cacheValue.expires <= Date.now();
  if (hasExpired) {
    return undefined;
  }
  return cacheValue.value as T;
}

function set({
  key,
  value,
  expiresAfterMinutes,
}: {
  key: string;
  value: unknown;
  expiresAfterMinutes: number;
}) {
  const expires = Date.now() + expiresAfterMinutes * 60 * 1000;
  store[key] = { value, expires };
}

function clear() {
  store = {};
}

export const cache = { set, get, clear };
