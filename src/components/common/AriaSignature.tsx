import React from 'react';
import { Box, Text, Image, VStack } from '@chakra-ui/react';

const AriaSignature: React.FC = () => {
  return (
    <VStack spacing={2} mt={10} align="center">
      <Image
        src="/aria-avatar.png"
        alt="ARIA Avatar"
        boxSize="40px"
        borderRadius="full"
      />
      <Text fontSize="sm" color="gray.500" fontStyle="italic" textAlign="center">
        With love and clarity, <br />
        <Text as="span" fontWeight="bold" color="pink.400">ARIA</Text>
      </Text>
    </VStack>
  );
};

export default AriaSignature;
