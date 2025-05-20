// components/admin/AdminHeader.tsx
import React from 'react';
import { Box, Flex, HStack, Text, Link as ChakraLink } from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const adminTabs = [
  { label: 'Referrals', href: '/admin/referrals' },
  { label: 'Badges', href: '/admin/badges' },
];

export default function AdminHeader() {
  const router = useRouter();

  return (
    <Box bg="gray.100" px={6} py={3} borderBottom="1px solid #e2e8f0">
      <Flex align="center" justify="space-between">
        <Text fontSize="lg" fontWeight="bold" color="pink.600">
          👑 Super Admin Panel
        </Text>
        <HStack spacing={6} fontSize="sm">
          {adminTabs.map(tab => (
            <Link key={tab.href} href={tab.href} passHref>
              <ChakraLink
                fontWeight={router.pathname === tab.href ? 'bold' : 'medium'}
                color={router.pathname === tab.href ? 'pink.600' : 'gray.600'}
              >
                {tab.label}
              </ChakraLink>
            </Link>
          ))}
        </HStack>
      </Flex>
    </Box>
  );
}
