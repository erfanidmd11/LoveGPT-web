// src/components/match/MatchList.tsx
import React, { useEffect, useState } from 'react';
import { Box, Heading, VStack } from '@chakra-ui/react';
import MatchPreviewCard from './MatchPreviewCard';
import { DealBreaker } from '@/types';

interface Candidate {
  id: string;
  name: string;
  traits: string[];
  bio: string;
}

interface UserProfile {
  dealBreakers: DealBreaker[];
}

interface MatchListProps {
  userProfile: UserProfile;
}

export default function MatchList({ userProfile }: MatchListProps) {
  const [matches, setMatches] = useState<Candidate[]>([]);

  useEffect(() => {
    setMatches([
      {
        id: 'match001',
        name: 'Lena',
        traits: ['Smoking 🚬', 'Open relationships 🧑‍🤝‍🧑'],
        bio: 'Yoga teacher & coffee addict. Looking for something real.',
      },
      {
        id: 'match002',
        name: 'Marcus',
        traits: ['Doesn’t want kids ❌👶', 'Spiritual ✨'],
        bio: 'Gemini. Writer. Backpacker.',
      },
      {
        id: 'match003',
        name: 'Riya',
        traits: ['Monogamous 💍', 'Vegan 🌱'],
        bio: 'Passionate about design, books, and dogs 🐶.',
      },
    ]);
  }, []);

  return (
    <Box>
      <Heading as="h2" size="lg" color="pink.500" mb={6}>
        Your Matches
      </Heading>

      <VStack spacing={6} align="stretch">
        {matches.map((match) => (
          <MatchPreviewCard
            key={match.id}
            userDealBreakers={userProfile.dealBreakers}
            candidate={match}
            onOpenProfile={(candidate) =>
              console.log('👀 Open profile:', candidate)
            }
          />
        ))}
      </VStack>
    </Box>
  );
}
