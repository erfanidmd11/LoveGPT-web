// src/components/dashboard/MatchReadinessWidget.tsx
import React, { useEffect, useState } from 'react';
import {
  Box,
  Text,
  Heading,
  CircularProgress,
  CircularProgressLabel,
  Stack,
  Progress,
  Button,
} from '@chakra-ui/react';
import { calculateMatchReadiness } from '@/lib/matchReadiness';
import { getAllAnswers } from '@/lib/getAllOnboardingAnswers';

interface MatchReadinessResult {
  score: number;
  category: string;
  insights: string[];
}

export default function MatchReadinessWidget() {
  const [readiness, setReadiness] = useState<MatchReadinessResult | null>(null);

  useEffect(() => {
    const data = getAllAnswers();
    const result = calculateMatchReadiness(data);
    setReadiness(result);
  }, []);

  if (!readiness) return null;

  return (
    <Box p={5} bg="white" borderRadius="xl" borderWidth={1} boxShadow="md">
      <Heading size="md" color="pink.600" mb={4}>
        💡 Match Readiness Score
      </Heading>

      <Stack direction={{ base: 'column', sm: 'row' }} align="center" spacing={6}>
        <CircularProgress
          value={readiness.score}
          color="pink.400"
          size="100px"
          thickness="12px"
        >
          <CircularProgressLabel fontSize="2xl" fontWeight="bold" color="pink.600">
            {readiness.score}
          </CircularProgressLabel>
        </CircularProgress>

        <Box flex="1">
          <Text fontWeight="semibold" fontSize="md" color="gray.700">
            {readiness.category}
          </Text>
          <Progress
            colorScheme="pink"
            size="sm"
            value={readiness.score}
            mt={2}
            borderRadius="md"
          />
        </Box>
      </Stack>

      <Text mt={4} fontSize="sm" fontStyle="italic" color="gray.600">
        {readiness.insights[0]}
      </Text>

      <Button
        variant="link"
        colorScheme="pink"
        size="sm"
        mt={3}
        onClick={() => (window.location.href = '/onboarding/edit')}
      >
        🔄 Reflect & Improve
      </Button>
    </Box>
  );
}
