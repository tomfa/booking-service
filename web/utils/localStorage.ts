export const setItem = (key: string, value: string | null) => {
  if (typeof window === 'undefined') {
    return null;
  }
  if (value === null) {
    return window.localStorage.removeItem(key);
  }
  return window.localStorage.setItem(key, value);
};

export const getItem = (key: string): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }
  return window.localStorage.getItem(key) || null;
};
