// src/components/ReferralTree.tsx
import React, { useEffect, useState } from 'react';
import {
  Box, Heading, Text, Stack, Badge, Spinner, Avatar, Flex,
  Collapse, IconButton, Link
} from '@chakra-ui/react';
import { ChevronDownIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { getReferralTree, getReferralChain } from '@/lib/referrals';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useRouter } from 'next/router';

interface ReferralNode {
  userId: string;
  level: number;
  name?: string;
  email?: string;
  points?: number;
  photoURL?: string;
  joinedAt?: string;
}

interface ReferralTreeProps {
  rootUserId: string;
  allowChainLinks?: boolean;
}

const ReferralTree: React.FC<ReferralTreeProps> = ({ rootUserId, allowChainLinks = false }) => {
  const [referrals, setReferrals] = useState<ReferralNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedLevels, setExpandedLevels] = useState<number[]>([1]);
  const [referralChain, setReferralChain] = useState<{ id: string; name: string }[]>([]);
  const router = useRouter();

  useEffect(() => {
    const loadTree = async () => {
      setLoading(true);
      const flatList = await getReferralTree(rootUserId);
      const chainIds = await getReferralChain(rootUserId);

      const detailed = await Promise.all(
        flatList.map(async (ref) => {
          const snap = await getDoc(doc(db, 'users', ref.userId));
          const data = snap.exists() ? snap.data() : {};
          return {
            ...ref,
            name: data.onboardingName || 'Anonymous',
            email: data.email || 'N/A',
            points: data.referralPoints || 0,
            photoURL: data.photoURL || '',
            joinedAt: data.createdAt?.toDate?.().toLocaleDateString() || 'N/A',
          };
        })
      );

      const chainWithNames = await Promise.all(
        chainIds.map(async (id) => {
          const snap = await getDoc(doc(db, 'users', id));
          const data = snap.exists() ? snap.data() : {};
          return {
            id,
            name: data.onboardingName || 'Anonymous',
          };
        })
      );

      setReferrals(detailed);
      setReferralChain(chainWithNames);
      setLoading(false);
    };

    if (rootUserId) loadTree();
  }, [rootUserId]);

  const toggleLevel = (level: number) => {
    setExpandedLevels((prev) =>
      prev.includes(level) ? prev.filter((l) => l !== level) : [...prev, level]
    );
  };

  const handleJump = (userId: string) => {
    if (allowChainLinks) {
      router.push(`/admin/referrals?userId=${userId}`);
    }
  };

  if (loading) return <Spinner color="pink.500" />;
  if (!referrals.length) return <Text>No referrals found.</Text>;

  return (
    <Box mt={6}>
      <Heading size="md" mb={4} color="pink.600">Referral Tree (5 Levels)</Heading>

      {referralChain.length > 0 && (
        <Box mb={6}>
          <Text fontWeight="medium" color="gray.600">
            You were referred by:
          </Text>
          <Stack mt={2} spacing={1} fontSize="sm" color="gray.700">
            {referralChain.map((ref, idx) => (
              <Text key={idx} cursor={allowChainLinks ? 'pointer' : 'default'} onClick={() => handleJump(ref.id)} _hover={allowChainLinks ? { textDecoration: 'underline', color: 'pink.600' } : {}}>
                Level {idx + 1}: {ref.name}
              </Text>
            ))}
          </Stack>
        </Box>
      )}

      {[1, 2, 3, 4, 5].map(level => {
        const levelRefs = referrals.filter(r => r.level === level);
        const isOpen = expandedLevels.includes(level);
        return (
          <Box key={level} mb={6}>
            <Flex align="center" justify="space-between" mb={2}>
              <Text fontWeight="bold" fontSize="lg">
                Level {level} ({levelRefs.length})
              </Text>
              <IconButton
                icon={isOpen ? <ChevronDownIcon /> : <ChevronRightIcon />}
                aria-label={`Toggle level ${level}`}
                onClick={() => toggleLevel(level)}
                size="sm"
              />
            </Flex>
            <Collapse in={isOpen} animateOpacity>
              <Stack spacing={3}>
                {levelRefs.map((r, idx) => (
                  <Flex
                    key={idx}
                    p={3}
                    borderWidth={1}
                    rounded="md"
                    shadow="sm"
                    align="center"
                    gap={4}
                    flexWrap="wrap"
                  >
                    <Avatar name={r.name} src={r.photoURL} size="md" />
                    <Box minW="180px">
                      <Text fontWeight="medium">{r.name}</Text>
                      <Text fontSize="sm" color="gray.500">{r.email}</Text>
                      <Text fontSize="xs" color="gray.400">Joined: {r.joinedAt}</Text>
                    </Box>
                    <Badge colorScheme="pink">Level {r.level}</Badge>
                    <Badge ml="auto" colorScheme="green" fontSize="sm">
                      {r.points} pts
                    </Badge>
                  </Flex>
                ))}
              </Stack>
            </Collapse>
          </Box>
        );
      })}
    </Box>
  );
};

export default ReferralTree;
