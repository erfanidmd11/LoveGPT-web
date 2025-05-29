import React, { useState, useEffect } from 'react';
import {
  Box, Heading, IconButton, useDisclosure, HStack, VStack, Link,
  Drawer, DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton, Spacer, Text, Image, Button
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import NextLink from 'next/link';

interface HeaderProps {
  onWaitlistClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onWaitlistClick }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [show, setShow] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  const menuLinks = [
    { href: '/', label: 'Home' },
    { href: '/about', label: 'About Us' },
    { href: '/aria', label: 'Meet ARIA' },
    { href: '/pricing', label: 'Cost' },
  ];

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setShow(currentScrollY < lastScrollY || currentScrollY < 10);
      setLastScrollY(currentScrollY);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  return (
    <Box
      as="header"
      bg="white"
      color="pink.600"
      px={6}
      py={4}
      position="sticky"
      top={0}
      zIndex={1000}
      boxShadow="sm"
      transform={show ? 'translateY(0)' : 'translateY(-100%)'}
      transition="transform 0.3s ease-in-out"
    >
      <HStack maxW="7xl" mx="auto" justifyContent="space-between">
        <NextLink href="/" passHref>
          <Link display="flex" alignItems="center" _hover={{ textDecoration: 'none' }}>
            <Image src="/logo.svg" alt="LoveGPT Logo" boxSize="32px" mr={2} />
            <Text fontWeight="bold" fontSize="lg">LoveGPT</Text>
          </Link>
        </NextLink>

        <IconButton
          icon={<HamburgerIcon />}
          onClick={onOpen}
          display={{ base: 'block', md: 'none' }}
          colorScheme="pink"
          variant="ghost"
          aria-label="Open navigation menu"
        />

        {/* Desktop Menu */}
        <HStack spacing={6} display={{ base: 'none', md: 'flex' }} alignItems="center">
          {menuLinks.map(({ href, label }) => (
            <Link
              key={href}
              as={NextLink}
              href={href}
              fontWeight="medium"
              _hover={{ color: 'pink.500' }}
            >
              {label}
            </Link>
          ))}
          <Button
            onClick={onWaitlistClick}
            px={4}
            py={2}
            bgGradient="linear(to-r, pink.400, purple.400)"
            color="white"
            rounded="full"
            fontWeight="bold"
            _hover={{ bg: 'pink.600' }}
          >
            Join Waitlist
          </Button>
        </HStack>
      </HStack>

      {/* Mobile Drawer Menu */}
      <Drawer isOpen={isOpen} onClose={onClose} placement="top">
        <DrawerOverlay />
        <DrawerContent bg="gray.900">
          <DrawerCloseButton color="white" />
          <DrawerHeader color="white">Menu</DrawerHeader>
          <DrawerBody>
            <VStack spacing={6} align="start" color="white" fontSize="lg">
              {menuLinks.map(({ href, label }) => (
                <Link as={NextLink} key={href} href={href} onClick={onClose} _hover={{ color: 'pink.400' }}>
                  {label}
                </Link>
              ))}
              <Button
                onClick={() => {
                  onClose();
                  onWaitlistClick?.();
                }}
                bgGradient="linear(to-r, pink.500, purple.500)"
                px={4}
                py={2}
                rounded="full"
                fontWeight="bold"
                _hover={{ bg: 'pink.600' }}
              >
                Join Waitlist
              </Button>
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};

export default Header;
