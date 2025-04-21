// src/components/dashboard/GamifiedProfileWidget.tsx

import React, { useEffect, useState } from 'react';
import {
  Box,
  Text,
  Heading,
  Badge as ChakraBadge,
  Stack,
  Flex,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import { calculateUserPoints } from '@/lib/pointEngine';
import { getLevel, LevelInfo } from '@/lib/LevelLogic';
import { getBadges, Badge } from '@/lib/badgeManager';
import { getAllAnswers } from '@/lib/getAllOnboardingAnswers';

interface OnboardingAnswers {
  [key: string]: any;
}

export default function GamifiedProfileWidget() {
  const [points, setPoints] = useState<number>(0);
  const [levelInfo, setLevelInfo] = useState<LevelInfo>({
    level: 1,
    title: 'Reflector',
  });
  const [badges, setBadges] = useState<Badge[]>([]);

  useEffect(() => {
    const userData: OnboardingAnswers = getAllAnswers();
    const totalPoints = calculateUserPoints(userData);
    const level = getLevel(totalPoints);
    const earnedBadges = getBadges(userData);

    setPoints(totalPoints);
    setLevelInfo(level);
    setBadges(earnedBadges);
  }, []);

  return (
    <Box
      bg="white"
      p={6}
      borderWidth="1px"
      borderRadius="xl"
      boxShadow="md"
      w="100%"
    >
      <Heading size="md" color="pink.600" mb={2}>
        🎮 Your Growth Stats
      </Heading>

      <Text fontSize="lg" fontWeight="bold" color="blue.700">
        XP: {points} pts —{' '}
        <Box as="span" color="pink.500">
          {levelInfo.title}
        </Box>
      </Text>

      <Box mt={4}>
        <Text fontSize="sm" fontWeight="semibold" color="gray.600" mb={1}>
          🏅 Badges Earned:
        </Text>
        <Wrap spacing={2}>
          {badges.length > 0 ? (
            badges.map((badge, i) => (
              <WrapItem key={i}>
                <ChakraBadge
                  colorScheme="pink"
                  px={3}
                  py={1}
                  borderRadius="full"
                  fontSize="sm"
                  variant="subtle"
                >
                  {badge.emoji} {badge.label}
                </ChakraBadge>
              </WrapItem>
            ))
          ) : (
            <Text fontSize="xs" color="gray.400" fontStyle="italic">
              No badges yet. Keep growing!
            </Text>
          )}
        </Wrap>
      </Box>
    </Box>
  );
}
