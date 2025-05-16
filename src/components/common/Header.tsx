import React, { useState } from 'react';
import { Box, Heading, IconButton, useDisclosure, HStack, VStack, Link, Avatar, Menu, MenuButton, MenuList, MenuItem, Drawer, DrawerBody, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton } from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import { getUserSession } from '@/utils/auth'; // Utility to check if user is logged in

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isOpen: drawerIsOpen, onOpen, onClose } = useDisclosure();
  const history = useHistory();
  const userSession = getUserSession();  // Get user session to check if logged in

  const toggleDrawer = () => {
    setIsOpen(!isOpen);
    onOpen();
  };

  // Logout function
  const handleLogout = () => {
    // Logic to logout user
    // For now we will redirect to homepage, assuming a logout function exists
    history.push('/');
  };

  // Conditional rendering for logged in vs logged out
  const loggedInMenu = (
    <Menu>
      <MenuButton as={Avatar} size="sm" />
      <MenuList>
        <MenuItem as={RouterLink} to="/dashboard">Dashboard</MenuItem>
        <MenuItem onClick={handleLogout}>Logout</MenuItem>
      </MenuList>
    </Menu>
  );

  const loggedOutMenu = (
    <HStack spacing={6}>
      <Link as={RouterLink} to="/about-us">About Us</Link>
      <Link as={RouterLink} to="/meet-aria">Meet ARIA</Link>
      <Link as={RouterLink} to="/cost">Cost</Link>
      <Link as={RouterLink} to="/signup-login">Sign Up / Login</Link>
    </HStack>
  );

  return (
    <Box as="header" bg="gray.800" p={4} color="white" textAlign="center">
      <HStack justifyContent="space-between">
        <Heading size="md" fontWeight="bold">
          LoveGPT
        </Heading>

        {/* Hamburger Icon for Mobile */}
        <IconButton
          icon={<HamburgerIcon />}
          onClick={toggleDrawer}
          display={{ base: 'block', md: 'none' }}  // Only show on mobile
          colorScheme="pink"
          variant="outline"
        />

        {/* Logged In or Out Menu */}
        {userSession ? loggedInMenu : loggedOutMenu}
      </HStack>

      {/* Drawer for Hamburger Menu (Mobile) */}
      <Drawer isOpen={drawerIsOpen} onClose={onClose} placement="top">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader bg="gray.800" color="white">Menu</DrawerHeader>

          <DrawerBody bg="gray.800">
            <VStack spacing={4} color="white">
              {userSession ? (
                <>
                  <Link as={RouterLink} to="/dashboard">Dashboard</Link>
                  <Link as={RouterLink} to="/" onClick={handleLogout}>Logout</Link>
                </>
              ) : (
                <>
                  <Link as={RouterLink} to="/">Home</Link>
                  <Link as={RouterLink} to="/about-us">About Us</Link>
                  <Link as={RouterLink} to="/meet-aria">Meet ARIA</Link>
                  <Link as={RouterLink} to="/cost">Cost</Link>
                  <Link as={RouterLink} to="/signup-login">Sign Up / Login</Link>
                </>
              )}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Desktop Menu */}
      <HStack spacing={6} display={{ base: 'none', md: 'flex' }}>
        <Link as={RouterLink} to="/">Home</Link>
        <Link as={RouterLink} to="/about-us">About Us</Link>
        <Link as={RouterLink} to="/meet-aria">Meet ARIA</Link>
        <Link as={RouterLink} to="/cost">Cost</Link>
        {userSession ? (
          <>
            <Link as={RouterLink} to="/dashboard">Dashboard</Link>
            <Link as={RouterLink} to="/" onClick={handleLogout}>Logout</Link>
          </>
        ) : (
          <Link as={RouterLink} to="/signup-login">Sign Up / Login</Link>
        )}
      </HStack>
    </Box>
  );
};

export default Header;
