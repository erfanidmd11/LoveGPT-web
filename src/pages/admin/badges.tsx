// src/pages/admin/badges.tsx
import React, { useEffect, useState } from 'react';
import {
  Box, Heading, Table, Thead, Tbody, Tr, Th, Td, Text, Badge, Spinner
} from '@chakra-ui/react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import DashboardLayout from '@/layouts/DashboardLayout';
import AdminHeader from '@/components/admin/AdminHeader';
import { format } from 'date-fns';

interface BadgeEvent {
  userId: string;
  badge: string;
  referralCount: number;
  updatedAt: { seconds: number; nanoseconds: number };
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export default function AdminBadges() {
  const [events, setEvents] = useState<BadgeEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      const q = query(collection(db, 'referralBadgeEvents'), orderBy('updatedAt', 'desc'));
      const snap = await getDocs(q);
      const list = snap.docs.map(doc => doc.data()) as BadgeEvent[];
      setEvents(list);
      setLoading(false);
    };

    fetchEvents();
  }, []);

  return (
    <DashboardLayout>
      <AdminHeader />
      {/* Add link to Badge Tiers */}
      <Box mb={4}>
        <Text
          as="a"
          href="/badges"
          fontSize="sm"
          color="pink.500"
          _hover={{ textDecoration: 'underline' }}
        >
          🌟 View Badge Tiers
        </Text>
      </Box>
      <Box maxW="7xl" mx="auto" px={6} py={12}>
        <Heading size="lg" mb={6} color="pink.600">🎖 Badge Assignment Log</Heading>
        <Text fontSize="sm" mt={-3} mb={6}>
          Need a refresher? <a href="/badges" className="text-pink-500 underline">See all badge tiers</a>
        </Text>
        {loading ? (
          <Spinner size="lg" />
        ) : (
          <Table variant="simple" fontSize="sm">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>Phone</Th>
                <Th>Badge</Th>
                <Th>Referrals</Th>
                <Th>Updated</Th>
              </Tr>
            </Thead>
            <Tbody>
              {events.map((ev, i) => (
                <Tr key={i}>
                  <Td>{ev.firstName} {ev.lastName}</Td>
                  <Td>{ev.email}</Td>
                  <Td>{ev.phone}</Td>
                  <Td><Badge colorScheme="pink">{ev.badge}</Badge></Td>
                  <Td>{ev.referralCount}</Td>
                  <Td>{format(new Date(ev.updatedAt.seconds * 1000), 'PPP p')}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </Box>
    </DashboardLayout>
  );
}
