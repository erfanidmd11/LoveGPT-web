import React from 'react';
import { Box, HStack, Link, Text, VStack, Image, Button } from '@chakra-ui/react';
import NextLink from 'next/link';
import { FaInstagram } from 'react-icons/fa';

const Footer: React.FC<{ onWaitlistClick?: () => void }> = ({ onWaitlistClick }) => {
  return (
    <Box as="footer" bg="gray.800" color="white" py={10} px={6}>
      <HStack
        maxW="7xl"
        mx="auto"
        justify="space-between"
        flexDirection={{ base: 'column', md: 'row' }}
        spacing={{ base: 10, md: 0 }}
        alignItems="flex-start"
      >
        {/* Section 1 */}
        <VStack align="flex-start" spacing={3}>
          <Text fontWeight="bold" fontSize="lg">Explore</Text>
          <Link as={NextLink} href="/about">About Us</Link>
          <Link as={NextLink} href="/aria">Meet ARIA</Link>
          <Link as={NextLink} href="/pricing">Cost</Link>
          <Link as={NextLink} href="/privacy">Privacy Policy</Link>
          <Link as={NextLink} href="/terms">Terms of Use</Link>
          <Link as={NextLink} href="/investors">Investors</Link>
        </VStack>

        {/* Section 2 */}
        <VStack align="flex-start" spacing={3}>
          <Text fontWeight="bold" fontSize="lg">Coming Soon</Text>
          <HStack>
            <Image src="/android-icon.png" alt="Android" boxSize="24px" />
            <Text fontSize="sm">Android App</Text>
            <Text fontSize="xs" color="gray.400">(Coming Soon)</Text>
          </HStack>
          <HStack>
            <Image src="/ios-icon.png" alt="iOS" boxSize="24px" />
            <Text fontSize="sm">iOS App</Text>
            <Text fontSize="xs" color="gray.400">(Coming Soon)</Text>
          </HStack>
        </VStack>

        {/* Section 3 */}
        <VStack align="flex-start" spacing={3}>
          <Text fontWeight="bold" fontSize="lg">Connect</Text>
          <Link
            href="https://www.instagram.com/mylovegpt"
            isExternal
            display="flex"
            alignItems="center"
            gap={2}
          >
            <FaInstagram />
            <Text>Contact Us on Instagram</Text>
          </Link>
          <Button
            onClick={onWaitlistClick}
            bgGradient="linear(to-r, pink.500, purple.500)"
            color="white"
            size="sm"
            rounded="full"
            fontWeight="bold"
            _hover={{ bg: 'pink.600' }}
          >
            Join Waitlist
          </Button>
          <Text fontSize="sm">&copy; {new Date().getFullYear()} LoveGPT. All rights reserved.</Text>
        </VStack>
      </HStack>
    </Box>
  );
};

export default Footer;
