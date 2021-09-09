export const config = {
  WEB_URL: process.env.WEB_URL || 'https://vailable.eu',
  MOCK_API: process.env.NEXT_PUBLIC_MOCK_API === '1',
  API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000',
  CONFIG_BUILD_ID: process.env.CONFIG_BUILD_ID as string,
  GRAPHQL_API_KEY: process.env.NEXT_PUBLIC_GRAPHQL_API_KEY as string,
  GRAPHQL_ENDPOINT: process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT as string,
};
