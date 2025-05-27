import React, { useState } from 'react';
import {
  Box, Heading, IconButton, useDisclosure, HStack, VStack, Link,
  Drawer, DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import NextLink from 'next/link';

const Header: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const menuLinks = [
    { href: '/', label: 'Home' },
    { href: '/about-us', label: 'About Us' },
    { href: '/meet-aria', label: 'Meet ARIA' },
    { href: '/cost', label: 'Cost' },
  ];

  return (
    <Box as="header" bg="gray.800" p={4} color="white" textAlign="center">
      <HStack justifyContent="space-between">
        <Heading size="md" fontWeight="bold">
          <NextLink href="/" passHref>
            <Link _hover={{ textDecoration: 'none' }}>LoveGPT</Link>
          </NextLink>
        </Heading>

        <IconButton
          icon={<HamburgerIcon />}
          onClick={onOpen}
          display={{ base: 'block', md: 'none' }}
          colorScheme="pink"
          variant="outline"
          aria-label="Open navigation menu"
        />

        {/* Desktop Menu */}
        <HStack spacing={6} display={{ base: 'none', md: 'flex' }}>
          {menuLinks.map(({ href, label }) => (
            <Link as={NextLink} key={href} href={href}>{label}</Link>
          ))}
          <Link as={NextLink} href="/#waitlist">Join Waitlist</Link>
        </HStack>
      </HStack>

      {/* Mobile Drawer Menu */}
      <Drawer isOpen={isOpen} onClose={onClose} placement="top">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader bg="gray.800" color="white">Menu</DrawerHeader>
          <DrawerBody bg="gray.800">
            <VStack spacing={4} color="white">
              {menuLinks.map(({ href, label }) => (
                <Link as={NextLink} key={href} href={href} onClick={onClose}>
                  {label}
                </Link>
              ))}
              <Link as={NextLink} href="/#waitlist" onClick={onClose}>
                Join Waitlist
              </Link>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default Header;
