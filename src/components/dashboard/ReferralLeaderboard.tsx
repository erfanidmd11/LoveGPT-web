// src/components/dashboard/ReferralLeaderboard.tsx
import React, { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  List,
  ListItem,
  Text,
  Flex,
  Divider,
  Badge,
} from '@chakra-ui/react';
import { db } from '@/lib/firebase';
import {
  collection,
  getDocs,
  query,
  orderBy,
  limit,
} from 'firebase/firestore';

interface Leader {
  id: string;
  name: string;
  points: number;
  referrals: number;
  level: number;
}

export default function ReferralLeaderboard() {
  const [leaders, setLeaders] = useState<Leader[]>([]);

  useEffect(() => {
    const fetchReferrals = async () => {
      const q = query(
        collection(db, 'users'),
        orderBy('referralPoints', 'desc'),
        limit(10)
      );

      const snapshot = await getDocs(q);
      const list: Leader[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        name: doc.data().onboardingName || 'Anonymous',
        points: doc.data().referralPoints || 0,
        referrals: doc.data().referrals?.length || 0,
        level: doc.data().referralLevel || 1,
      }));

      setLeaders(list);
    };

    fetchReferrals();
  }, []);

  if (!leaders.length) return null;

  return (
    <Box bg="white" p={5} rounded="xl" shadow="md">
      <Heading size="md" color="pink.600" mb={4}>
        🏆 Top Referrers
      </Heading>

      <List spacing={4}>
        {leaders.map((user, i) => (
          <ListItem key={user.id}>
            <Flex justify="space-between" align="center">
              <Box>
                <Text fontWeight="medium" color="gray.800">
                  {i + 1}. {user.name}
                </Text>
                <Text fontSize="xs" color="gray.500">
                  {user.referrals} referrals • Level {user.level}
                </Text>
              </Box>
              <Badge
                colorScheme="pink"
                fontSize="sm"
                fontWeight="semibold"
                px={3}
                py={1}
                borderRadius="lg"
              >
                {user.points} pts
              </Badge>
            </Flex>
            {i < leaders.length - 1 && <Divider mt={2} />}
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
