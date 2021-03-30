export const theme = {
  fonts: {
    primary:
      '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,\n' +
      '    Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif',
    secondary: "'Barlow Condensed', sans-serif",
  },
  colors: {
    primary: '#8BA02A',
    secondary: '#C6A666',
    bgPrimary: '#232828',
    bgSecondary: '#FAFAFA',
    textPrimary: '#FFFFFF',
    textSecondary: '#000000',
    links: '#0070f3',

    success: '#139113',
    bgSuccess: '#016201',
    danger: '#ca082a',
    bgDanger: '#9d041f',
  },
  layout: {
    maxWidth: '800',
  },
};

export type Theme = typeof theme;

export default theme;
