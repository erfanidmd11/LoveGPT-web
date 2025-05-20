import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/lib/firebase';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { SUPER_ADMINS } from '@/config/admins';
import {
  Box, Flex, Button, IconButton, useDisclosure,
  Drawer, DrawerOverlay, DrawerContent, DrawerHeader, DrawerBody,
  DrawerCloseButton, VStack, Text, Avatar, HStack
} from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import { doc, getDoc } from 'firebase/firestore';
import UserBadgeDisplay from '@/components/UserBadgeDisplay';

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  const [user] = useAuthState(auth);
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [badge, setBadge] = useState<string>('');

  const handleLogout = () => {
    auth.signOut();
    router.push('/');
  };

  const isActive = (href: string) => router.pathname === href;

  const handleNavClick = (href: string) => {
    onClose();
    router.push(href);
  };

  useEffect(() => {
    const fetchBadge = async () => {
      if (user) {
        const ref = doc(db, 'users', user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          setBadge(data?.badges?.[0] || '');
        }
      }
    };
    fetchBadge();
  }, [user]);

  const SidebarLinks = () => (
    <VStack align="start" spacing={4} p={4}>
      <Text fontSize="sm" color="gray.500">Navigation</Text>

      <Text onClick={() => handleNavClick('/dashboard')} className={isActive('/dashboard') ? 'text-pink-600 font-bold cursor-pointer' : 'text-gray-700 hover:text-pink-600 cursor-pointer'}>
        🏠 Dashboard
      </Text>

      <Text onClick={() => handleNavClick('/dashboard/my-referrals')} className={isActive('/dashboard/my-referrals') ? 'text-pink-600 font-bold cursor-pointer' : 'text-gray-700 hover:text-pink-600 cursor-pointer'}>
        📣 My Referrals
      </Text>

      <Text onClick={() => handleNavClick('/badges')} className={isActive('/badges') ? 'text-pink-600 font-bold cursor-pointer' : 'text-gray-700 hover:text-pink-600 cursor-pointer'}>
        🌟 Badge Tiers
      </Text>

      {user && SUPER_ADMINS.includes(user.email || '') && (
        <>
          <Text fontSize="sm" color="gray.500" pt={2}>Admin Panel</Text>
          <Text onClick={() => handleNavClick('/admin/referrals')} className={isActive('/admin/referrals') ? 'text-red-600 font-bold cursor-pointer' : 'text-red-600 hover:text-red-700 cursor-pointer'}>
            🧭 Referral Explorer
          </Text>
          <Text onClick={() => handleNavClick('/admin/badges')} className={isActive('/admin/badges') ? 'text-red-600 font-bold cursor-pointer' : 'text-red-600 hover:text-red-700 cursor-pointer'}>
            🎖 Badge Log
          </Text>
        </>
      )}

      <Button size="sm" variant="outline" onClick={handleLogout}>Logout</Button>
    </VStack>
  );

  return (
    <Box minH="100vh" display="flex" flexDirection="column">
      <Flex as="header" bg="gray.50" p={4} justify="space-between" align="center">
        <Box fontWeight="bold" fontSize="lg">
          <Link href="/dashboard">LoveGPT</Link>
        </Box>
        <Flex align="center" gap={3}>
          {user && (
            <HStack display={{ base: 'none', md: 'flex' }} align="center" gap={3}>
              <Avatar name={user.displayName || ''} src={user.photoURL || ''} size="sm" />
              <Text fontSize="sm" color="gray.600">{user.displayName || 'User'}</Text>
              <UserBadgeDisplay badge={badge} size={24} />
            </HStack>
          )}
          <IconButton
            icon={<HamburgerIcon />}
            aria-label="Open menu"
            onClick={onOpen}
            display={{ base: 'flex', md: 'none' }}
          />
        </Flex>
        <Flex display={{ base: 'none', md: 'flex' }} align="center" gap={4}>
          {user && <SidebarLinks />}
        </Flex>
      </Flex>

      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Menu</DrawerHeader>
          <DrawerBody>
            {user && <SidebarLinks />}
            {!user && (
              <Link href="/login">
                <a className="text-pink-600 font-medium">Login</a>
              </Link>
            )}
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      <Box as="main" flex="1" p={6}>
        {children}
      </Box>

      <Box as="footer" textAlign="center" p={4} bg="gray.100">
        <Text fontSize="sm">Powered by ARIA — Your Emotional AI</Text>
      </Box>
    </Box>
  );
};

export default DashboardLayout;
