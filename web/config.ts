export const config = {
  MOCK_API: process.env.NEXT_PUBLIC_MOCK_API === '1',
  API_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
};
