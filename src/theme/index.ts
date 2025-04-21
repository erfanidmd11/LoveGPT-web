// src/theme/index.ts
import { extendTheme, ThemeConfig } from '@chakra-ui/react';

const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  fonts: {
    heading: `'Inter', sans-serif`,
    body: `'Inter', sans-serif`,
  },
  colors: {
    brand: {
      50: '#ffe4ec',
      100: '#ffb3c9',
      200: '#ff80a6',
      300: '#ff4d83',
      400: '#ff1a60',
      500: '#e60047',
      600: '#b40038',
      700: '#820029',
      800: '#51001a',
      900: '#21000b',
    },
  },
});

export default theme;
