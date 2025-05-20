// src/layouts/MainLayout.tsx
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { signOut, auth } from '@/lib/firebase';
import ARIAChat from '@/components/ARIAChat';
import { useAuthState } from 'react-firebase-hooks/auth';

import {
  Box, Flex, Text, Heading, Image, Button,
  Link as ChakraLink, IconButton, VStack, HStack,
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';

const LoginModal = dynamic(() => import('@/components/common/LoginModal'), { ssr: false });

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, loading] = useAuthState(auth);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);

  const handleLoginClick = () => setShowLoginModal(true);
  const handleSignUpClick = () => router.push('/signup');
  const handleLogoutClick = async () => {
    await signOut(auth);
    localStorage.removeItem('admin_logged_in');
    router.push('/');
  };

  const handleNavClick = (href: string) => {
    setMenuOpen(false);
    router.push(href);
  };

  const isActive = (href: string) => router.pathname === href;

  return (
    <Box minH="100vh" bgGradient="linear(to-br, pink.50, purple.100)">
      {/* Header */}
      <Box bg="white" px={4} py={3} shadow="md">
        <Flex maxW="7xl" mx="auto" align="center" justify="space-between">
          <ChakraLink as={NextLink} href="/" display="flex" alignItems="center" _hover={{ textDecoration: 'none' }}>
            <Image src="/lovegpt-logo.png" alt="Logo" w={8} h={8} />
            <Heading size="md" ml={2}>
              <Text as="span" color="pink.500">Love</Text>
              <Text as="span" color="blue.500">GPT</Text>
            </Heading>
          </ChakraLink>

          <IconButton
            aria-label="Menu"
            icon={<HamburgerIcon />}
            display={{ base: 'flex', md: 'none' }}
            onClick={() => setMenuOpen(!menuOpen)}
          />

          <HStack display={{ base: 'none', md: 'flex' }} spacing={5} fontWeight="medium">
            {['/', '/about', '/aria', '/pricing'].map((path, i) => (
              <ChakraLink
                key={i}
                as={NextLink}
                href={path}
                position="relative"
                _hover={{ color: 'pink.500' }}
                color={isActive(path) ? 'pink.600' : 'gray.700'}
                fontWeight={isActive(path) ? 'bold' : 'medium'}
                _after={isActive(path) ? {
                  content: '""',
                  position: 'absolute',
                  width: '100%',
                  height: '2px',
                  bg: 'pink.500',
                  bottom: '-4px',
                  left: 0,
                } : {}}
              >
                {path === '/' ? 'Home' : path.replace('/', '').replace(/\b\w/g, c => c.toUpperCase())}
              </ChakraLink>
            ))}
            {user ? (
              <>
                <ChakraLink as={NextLink} href="/dashboard" _hover={{ color: 'pink.500' }} color={isActive('/dashboard') ? 'pink.600' : 'gray.700'} fontWeight={isActive('/dashboard') ? 'bold' : 'medium'}>
                  Dashboard
                </ChakraLink>
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
            {['/', '/about', '/aria', '/pricing'].map((path, i) => (
              <Text
                key={i}
                onClick={() => handleNavClick(path)}
                color={isActive(path) ? 'pink.600' : 'gray.700'}
                fontWeight={isActive(path) ? 'bold' : 'medium'}
                cursor="pointer"
              >
                {path === '/' ? 'Home' : path.replace('/', '').replace(/\b\w/g, c => c.toUpperCase())}
              </Text>
            ))}
            {user ? (
              <>
                <Text onClick={() => handleNavClick('/dashboard')} color={isActive('/dashboard') ? 'pink.600' : 'gray.700'} fontWeight={isActive('/dashboard') ? 'bold' : 'medium'} cursor="pointer">
                  Dashboard
                </Text>
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
          <ChakraLink as={NextLink} href="/privacy">Privacy Policy</ChakraLink>
          <ChakraLink as={NextLink} href="/terms">Terms of Use</ChakraLink>
          <ChakraLink as={NextLink} href="/investors">Investors</ChakraLink>
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
