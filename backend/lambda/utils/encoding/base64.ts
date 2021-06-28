export const decode = (base64: string): string => {
  return Buffer.from(base64, 'base64').toString('utf-8');
};

export const encode = (data: string): string => {
  return Buffer.from(data, 'utf-8').toString('base64');
};
