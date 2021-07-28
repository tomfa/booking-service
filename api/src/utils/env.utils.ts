export const getOriginsFromEnv = (envString: string | undefined): string[] => {
  if (!envString) {
    return [];
  }
  return envString.split(',').map(domain => domain.trim());
};

export const getIssuerFromEnv = (iss: string | undefined): string => {
  if (!iss) {
    throw new Error(`Unable to clean undefined issuer value`);
  }
  return !iss.startsWith('http') ? iss : iss.split('//').reverse()[0];
};
