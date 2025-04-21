// src/pages/_app.tsx
import { ChakraProvider } from '@chakra-ui/react';
import theme from '@/theme';
import Head from 'next/head';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider theme={theme}>
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>LoveGPT — Conscious Relationship AI</title>
      </Head>
      <Component {...pageProps} />
    </ChakraProvider>
  );
}
