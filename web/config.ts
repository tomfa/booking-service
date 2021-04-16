export const config = {
  WEB_URL: process.env.WEB_URL || 'https://docforest.eu',
  MOCK_API: process.env.NEXT_PUBLIC_MOCK_API === '1',
  API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
  CONFIG_BUILD_ID: process.env.CONFIG_BUILD_ID as string,
};
