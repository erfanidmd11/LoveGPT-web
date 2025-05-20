// src/pages/dashboard/referrals.tsx
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import DashboardLayout from '@/layouts/DashboardLayout';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/lib/firebase';
import UserBadgeDisplay from '@/components/UserBadgeDisplay';
import {
  Box,
  Text,
  Spinner,
  Input,
  Button,
  Heading,
  HStack,
  VStack
} from '@chakra-ui/react';
import { collection, query, where, getDocs, doc, getDoc } from 'firebase/firestore';

export default function ReferralDashboard() {
  const [user, loading] = useAuthState(auth);
  const [referrals, setReferrals] = useState<any[]>([]);
  const [totalCoins, setTotalCoins] = useState(0);
  const [copied, setCopied] = useState(false);
  const [badge, setBadge] = useState<string>('');

  useEffect(() => {
    if (user) {
      fetchReferrals();
      fetchBadge();
    }
  }, [user]);

  const fetchReferrals = async () => {
    const q = query(collection(db, 'inviteApplications'), where('referredBy', '==', user?.uid));
    const snapshot = await getDocs(q);
    const list = snapshot.docs.map(doc => doc.data());
    setReferrals(list);

    const coinsEarned = list.reduce((sum, r) => sum + (r.level || 1) * 10, 0);
    setTotalCoins(coinsEarned);
  };

  const fetchBadge = async () => {
    const ref = doc(db, 'users', user?.uid || '');
    const snap = await getDoc(ref);
    if (snap.exists()) {
      setBadge(snap.data()?.badges?.[0] || '');
    }
  };

  const referralLink = `${typeof window !== 'undefined' ? window.location.origin : ''}/?ref=${user?.uid}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      alert('Failed to copy link');
    }
  };

  if (loading || !user) return <Spinner color="pink.500" mt={20} />;

  return (
    <DashboardLayout>
      <Head>
        <title>My Referrals | LoveGPT</title>
      </Head>

      <Box maxW="4xl" mx="auto" px={6} py={16}>
        <Heading size="lg" color="pink.600" mb={4}>📣 Your Referrals</Heading>

        <HStack mb={4} align="center">
          <Text fontSize="md">Your Badge:</Text>
          <UserBadgeDisplay badge={badge} size={28} />
        </HStack>

        <Text fontSize="lg" color="gray.600" mb={2}>
          You’ve referred <strong>{referrals.length}</strong> member{referrals.length !== 1 ? 's' : ''} and earned a total of{' '}
          <span className="text-pink-600 font-bold">{totalCoins}</span> Love Coins 💖
        </Text>

        <Box bg="white" border="1px solid #e2e8f0" p={4} rounded="xl" mb={6}>
          <Text fontSize="sm" color="gray.700" mb={2}>Your personal invite link:</Text>
          <HStack spacing={2}>
            <Input value={referralLink} readOnly fontSize="sm" />
            <Button size="sm" colorScheme="pink" onClick={copyToClipboard}>
              {copied ? 'Copied!' : 'Copy Link'}
            </Button>
          </HStack>
          <Text fontSize="xs" color="gray.500" mt={2}>
            You earn Love Coins for each signup, up to 5 levels deep: 10, 7, 5, 3, 2 per level.
          </Text>
        </Box>

        {referrals.length === 0 ? (
          <Text color="gray.500">No referrals yet. Invite someone today!</Text>
        ) : (
          <VStack spacing={4} align="stretch">
            {referrals.map((ref, i) => (
              <Box key={i} bg="white" shadow="sm" p={4} rounded="xl" borderLeft="4px solid #ec4899">
                <Text fontWeight="bold" color="pink.600">{ref.firstName} {ref.lastName}</Text>
                <Text fontSize="sm" color="gray.600">Level: {ref.level || 1}</Text>
                <Text fontSize="sm" color="gray.600">Email: {ref.email}</Text>
                <Text fontSize="sm" color="gray.500" mt={1}>
                  Match Intent: {ref.isMatchIntent ? 'Yes' : 'No'}
                </Text>
              </Box>
            ))}
          </VStack>
        )}
      </Box>
    </DashboardLayout>
  );
}
