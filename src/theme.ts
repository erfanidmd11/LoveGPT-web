import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  fonts: {
    heading: `'Helvetica Neue', sans-serif`,
    body: `'Arial', sans-serif`,
  },
  colors: {
    brand: {
      500: '#FF61A6',
    },
  },
});

export default theme;
