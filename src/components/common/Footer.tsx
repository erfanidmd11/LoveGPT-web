import React from 'react';
import { Box, Text, HStack, Link } from '@chakra-ui/react';

const Footer: React.FC = () => (
  <Box as="footer" bg="gray.800" p={4} color="white" textAlign="center">
    <Text>&copy; {new Date().getFullYear()} LoveGPT, All Rights Reserved.</Text>
    <HStack spacing={6} justify="center" mt={4}>
      <Link href="#" color="white">Privacy Policy</Link>
      <Link href="#" color="white">Terms of Use</Link>
      <Link href="#" color="white">Investors</Link>
      <Link href="#" color="white">Contact Us</Link>
    </HStack>
  </Box>
);

export default Footer;
