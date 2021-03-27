export const theme = {
  fonts: {
    primary:
      '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,\n' +
      '    Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif',
    secondary: "'Barlow Condensed', sans-serif",
  },
  colors: {
    primary: '#e3c346',
    secondary: '#52A5E3',
    bgPrimary: '#3a3a3a',
    bgSecondary: '#white',
    textPrimary: '#FFFFFF',
    textSecondary: '#3a3a3a',
    links: '#0070f3',

    success: '#139113',
    danger: '#ca082a',
  },
  layout: {
    maxWidth: '800',
  },
};

export type Theme = typeof theme;

export default theme;
