// src/pages/admin/badges.tsx
import React, { useEffect, useState } from 'react';
import {
  Box, Heading, Table, Thead, Tbody, Tr, Th, Td, Text, Badge, Spinner, Button
} from '@chakra-ui/react';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import AdminNavBar from '@/components/admin/AdminNavBar';
import { format } from 'date-fns';
import { sendMailgunEmail } from '@/lib/email/sendMailgunEmail';

interface BadgeEvent {
  id: string;
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
      const list = snap.docs.map(doc => ({ id: doc.id, ...doc.data() })) as BadgeEvent[];
      setEvents(list);
      setLoading(false);
    };

    fetchEvents();
  }, []);

  const notifyUser = async (entry: BadgeEvent) => {
    try {
      await sendMailgunEmail({
        to: entry.email,
        subject: `🎉 You've earned the "${entry.badge}" badge!`,
        text: `Hi ${entry.firstName},

Congrats! You've earned the "${entry.badge}" badge on LoveGPT for your amazing engagement. Keep building meaningful relationships!

Love,
ARIA ✨`,
      });
    } catch (err) {
      console.error('Failed to send badge email:', err);
    }
  };

  const notifyInviteApproval = async (entry: BadgeEvent) => {
    try {
      await sendMailgunEmail({
        to: entry.email,
        subject: '🎟 Your LoveGPT Invite Has Been Approved',
        text: `Hi ${entry.firstName},

You're officially in! Your invite to LoveGPT has been approved. Get ready for a transformative journey guided by ARIA — your AI-powered relationship strategist.

Let's build something beautiful.

Love,
ARIA ✨`,
      });
    } catch (err) {
      console.error('Failed to send invite approval email:', err);
    }
  };

  const notifyAll = async (entry: BadgeEvent) => {
    await notifyUser(entry);
    await notifyInviteApproval(entry);
  };

  return (
    <>
      <AdminNavBar />
      <Box maxW="7xl" mx="auto" px={6} py={12}>
        <Heading size="lg" mb={6} color="pink.600">🎖 Badge Assignment Log</Heading>
        <Text fontSize="sm" mt={-3} mb={6}>
          Need a refresher?{' '}
          <a href="/badges" className="text-pink-500 underline">See all badge tiers</a>
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
                <Th>Actions</Th>
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
                  <Td>
                    <Button size="sm" colorScheme="pink" onClick={() => notifyUser(ev)} mr={2}>
                      Notify Badge
                    </Button>
                    <Button size="sm" colorScheme="green" onClick={() => notifyInviteApproval(ev)} mr={2}>
                      Notify Invite
                    </Button>
                    <Button size="sm" colorScheme="blue" onClick={() => notifyAll(ev)}>
                      Notify All
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </Box>
    </>
  );
}
