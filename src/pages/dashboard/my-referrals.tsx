// src/pages/dashboard/my-referrals.tsx
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import DashboardLayout from '@/layouts/DashboardLayout';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/lib/firebase';
import ReferralTree from '@/components/ReferralTree';
import UserBadgeDisplay from '@/components/UserBadgeDisplay';
import {
  Spinner,
  Box,
  Text,
  Heading,
  Progress,
  HStack,
  VStack,
  Input,
  Button,
  useToast
} from '@chakra-ui/react';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';

export default function MyReferralsPage() {
  const [user, loading] = useAuthState(auth);
  const [badge, setBadge] = useState('');
  const [referralCount, setReferralCount] = useState(0);
  const toast = useToast();

  useEffect(() => {
    const fetchReferralStats = async () => {
      if (user) {
        const userRef = doc(db, 'users', user.uid);
        const userSnap = await getDoc(userRef);
        if (userSnap.exists()) {
          const data = userSnap.data();
          setBadge(data?.badges?.[0] || '');
        }

        const q = query(collection(db, 'invitationCodes'), where('referredBy', '==', user.uid));
        const snap = await getDocs(q);
        setReferralCount(snap.size);
      }
    };

    fetchReferralStats();
  }, [user]);

  if (loading) return <Spinner color="pink.500" mt={20} />;
  if (!user) return <Text mt={20}>Please log in to view your referrals.</Text>;

  const getNextBadgeGoal = (count: number) => {
    if (count >= 20) return { label: '🎉 Max Tier Reached', value: 100 };
    if (count >= 10) return { label: '🧠 LoveGPT Luminary in', value: Math.min((count / 20) * 100, 100), remaining: 20 - count };
    if (count >= 5) return { label: '💖 Matchmaker Elite in', value: (count / 10) * 100, remaining: 10 - count };
    if (count >= 3) return { label: "💌 Cupid's Assistant in", value: (count / 5) * 100, remaining: 5 - count };
    if (count >= 1) return { label: '💞 Spark Spreader in', value: (count / 3) * 100, remaining: 3 - count };
    return { label: '🌱 Seed Planter in', value: (count / 1) * 100, remaining: 1 - count };
  };

  const nextGoal = getNextBadgeGoal(referralCount);
  const referralLink = `${typeof window !== 'undefined' ? window.location.origin : ''}/?ref=${user.uid}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      toast({ title: 'Link copied to clipboard', status: 'success', duration: 2000 });
    } catch {
      toast({ title: 'Failed to copy link', status: 'error' });
    }
  };

  return (
    <DashboardLayout>
      <Head>
        <title>My Referrals | LoveGPT</title>
      </Head>

      <Box maxW="4xl" mx="auto" px={6} py={12}>
        <Heading size="lg" color="pink.600" mb={6}>📣 My Referrals</Heading>

        <VStack align="start" spacing={4} mb={10}>
          <HStack>
            <Text fontSize="md" fontWeight="medium">Your Current Badge:</Text>
            <UserBadgeDisplay badge={badge} size={32} />
          </HStack>
          <Text fontSize="sm" color="gray.600">Total Referrals: {referralCount}</Text>
          {nextGoal.remaining !== undefined && (
            <Box w="full">
              <Text fontSize="xs" color="gray.500">{nextGoal.label} {nextGoal.remaining} more</Text>
              <Progress value={nextGoal.value} size="sm" colorScheme="pink" borderRadius="lg" />
            </Box>
          )}
          <Box w="full">
            <Text fontSize="sm" mb={1}>Your Invite Link:</Text>
            <HStack>
              <Input value={referralLink} readOnly size="sm" fontSize="xs" />
              <Button size="sm" colorScheme="pink" onClick={copyToClipboard}>Copy</Button>
            </HStack>
          </Box>
        </VStack>

        <Text fontSize="lg" fontWeight="bold" mb={4}>👥 Your Referral Tree</Text>
        <ReferralTree rootUserId={user.uid} />
      </Box>
    </DashboardLayout>
  );
}
