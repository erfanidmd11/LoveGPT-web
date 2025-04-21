// src/layouts/MainLayout.tsx
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { signOut, auth } from '@/lib/firebase';
import ARIAChat from '@/components/ARIAChat';

import {
  Box,
  Flex,
  Text,
  Heading,
  Image,
  Button,
  Link as ChakraLink,
  IconButton,
  VStack,
  HStack,
  Spacer,
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';

const LoginModal = dynamic(() => import('@/components/common/LoginModal'), { ssr: false });

const useAuthState = typeof window !== 'undefined'
  ? require('react-firebase-hooks/auth').useAuthState
  : () => [null, true];

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, loading] = useAuthState(auth);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleLoginClick = () => setShowLoginModal(true);
  const handleSignUpClick = () => router.push("/signup");
  const handleLogoutClick = async () => {
    await signOut(auth);
    localStorage.removeItem("admin_logged_in");
    router.push("/");
  };

  return (
    <Box minH="100vh" bgGradient="linear(to-br, pink.50, purple.100)">
      {/* Header */}
      <Box bg="white" px={4} py={3} shadow="md">
        <Flex maxW="7xl" mx="auto" align="center" justify="space-between">
          <NextLink href="/" passHref>
            <ChakraLink display="flex" alignItems="center">
              <Image src="/lovegpt-logo.png" alt="Logo" w={8} h={8} />
              <Heading size="md" ml={2}>
                <Text as="span" color="pink.500">Love</Text>
                <Text as="span" color="blue.500">GPT</Text>
              </Heading>
            </ChakraLink>
          </NextLink>

          <IconButton
            aria-label="Menu"
            icon={<HamburgerIcon />}
            display={{ base: 'flex', md: 'none' }}
            onClick={() => setMenuOpen(!menuOpen)}
          />

          <HStack display={{ base: 'none', md: 'flex' }} spacing={5} fontWeight="medium">
            <NextLink href="/" passHref><ChakraLink _hover={{ color: 'pink.500' }}>Home</ChakraLink></NextLink>
            <NextLink href="/about" passHref><ChakraLink _hover={{ color: 'pink.500' }}>About Us</ChakraLink></NextLink>
            <NextLink href="/aria" passHref><ChakraLink _hover={{ color: 'pink.500' }}>Meet ARIA</ChakraLink></NextLink>
            <NextLink href="/pricing" passHref><ChakraLink _hover={{ color: 'pink.500' }}>Cost</ChakraLink></NextLink>
            {user ? (
              <>
                <NextLink href="/dashboard" passHref><ChakraLink _hover={{ color: 'pink.500' }}>Dashboard</ChakraLink></NextLink>
                <Button variant="outline" colorScheme="pink" onClick={handleLogoutClick}>Logout</Button>
              </>
            ) : (
              <>
                <Button variant="outline" colorScheme="pink" onClick={handleLoginClick}>Login</Button>
                <Button variant="outline" colorScheme="pink" onClick={handleSignUpClick}>Sign Up</Button>
              </>
            )}
          </HStack>
        </Flex>

        {menuOpen && (
          <VStack align="start" spacing={3} px={4} mt={4} display={{ md: 'none' }}>
            <NextLink href="/" passHref><ChakraLink onClick={() => setMenuOpen(false)}>Home</ChakraLink></NextLink>
            <NextLink href="/about" passHref><ChakraLink onClick={() => setMenuOpen(false)}>About Us</ChakraLink></NextLink>
            <NextLink href="/aria" passHref><ChakraLink onClick={() => setMenuOpen(false)}>Meet ARIA</ChakraLink></NextLink>
            <NextLink href="/pricing" passHref><ChakraLink onClick={() => setMenuOpen(false)}>Cost</ChakraLink></NextLink>
            {user ? (
              <>
                <NextLink href="/dashboard" passHref><ChakraLink onClick={() => setMenuOpen(false)}>Dashboard</ChakraLink></NextLink>
                <Button variant="outline" colorScheme="pink" onClick={handleLogoutClick}>Logout</Button>
              </>
            ) : (
              <>
                <Button variant="outline" colorScheme="pink" onClick={handleLoginClick}>Login</Button>
                <Button variant="outline" colorScheme="pink" onClick={handleSignUpClick}>Sign Up</Button>
              </>
            )}
          </VStack>
        )}
      </Box>

      {/* Main */}
      <Box as="main" flex="1" px={6} py={10}>
        {children}
      </Box>

      {/* Footer */}
      <Box textAlign="center" fontSize="sm" color="gray.500" py={4} mt={10}>
        <HStack justify="center" spacing={4} mb={2}>
          <NextLink href="/privacy" passHref><ChakraLink>Privacy Policy</ChakraLink></NextLink>
          <NextLink href="/terms" passHref><ChakraLink>Terms of Use</ChakraLink></NextLink>
          <NextLink href="/investors" passHref><ChakraLink>Investors</ChakraLink></NextLink>
        </HStack>
        © {new Date().getFullYear()} LoveGPT • Built with ❤️ by ARIA
      </Box>

      <ARIAChat />

      {showLoginModal && (
        <LoginModal onClose={() => setShowLoginModal(false)} onSuccess={() => setShowLoginModal(false)} />
      )}
    </Box>
  );
}
