// pages/admin/referrals.tsx
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import DashboardLayout from '@/layouts/DashboardLayout';
import AdminHeader from '@/components/admin/AdminHeader';
import ReferralTree from '@/components/ReferralTree';
import { Input, Button, Spinner, Box, Text } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/lib/firebase';
import { SUPER_ADMINS } from '@/config/admins';
import { doc, getDoc } from 'firebase/firestore';

export default function AdminReferralExplorer() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const [userId, setUserId] = useState('');
  const [submittedId, setSubmittedId] = useState('');
  const [treeLoading, setTreeLoading] = useState(false);
  const [userDetails, setUserDetails] = useState<{ name: string; email: string } | null>(null);

  useEffect(() => {
    if (router.query.userId) {
      const initial = router.query.userId as string;
      setUserId(initial);
      setSubmittedId(initial);
    }
  }, [router.query.userId]);

  const handleLoad = async () => {
    if (!userId) return;
    setTreeLoading(true);
    setSubmittedId(userId);

    const snap = await getDoc(doc(db, 'users', userId));
    const data = snap.exists() ? snap.data() : null;
    setUserDetails({
      name: data?.onboardingName || 'Unknown User',
      email: data?.email || 'N/A',
    });

    setTimeout(() => setTreeLoading(false), 500);
  };

  if (loading) return <Spinner mt={20} />;
  if (!user || !SUPER_ADMINS.includes(user.email)) {
    return (
      <DashboardLayout>
        <Box mt={20} textAlign="center">
          <Text fontSize="xl" color="red.500">
            ❌ You are not authorized to view this page.
          </Text>
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <AdminHeader />
      <Head>
        <title>Admin Referrals | LoveGPT</title>
      </Head>

      <Box className="max-w-4xl mx-auto px-6 py-16">
        <Text fontSize="3xl" fontWeight="bold" color="pink.600" mb={4}>
          🧭 Referral Tree Explorer
        </Text>
        <Text mb={4} color="gray.600">
          Enter a user ID to trace their 5-level referral network.
        </Text>

        <Box mb={6} display="flex" gap={4}>
          <Input
            placeholder="Enter user ID..."
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
          <Button onClick={handleLoad} colorScheme="pink">
            Trace
          </Button>
        </Box>

        {userDetails && (
          <Box mb={6} p={4} bg="white" borderRadius="lg" shadow="sm">
            <Text fontWeight="medium">User: <span className="text-pink-600">{userDetails.name}</span></Text>
            <Text fontSize="sm" color="gray.500">Email: {userDetails.email}</Text>
          </Box>
        )}

        {treeLoading && <Spinner color="pink.500" />}
        {!treeLoading && submittedId && (
          <ReferralTree rootUserId={submittedId} allowChainLinks={true} />
        )}
      </Box>
    </DashboardLayout>
  );
}
