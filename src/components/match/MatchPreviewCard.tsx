// src/components/match/MatchPreviewCard.tsx
import React, { useEffect, useState } from 'react';
import {
  Box,
  Text,
  Heading,
  Button,
  useDisclosure,
} from '@chakra-ui/react';
import MatchConflictWarningModal from './MatchConflictWarningModal';
import { saveAnswer } from '@/lib/saveAnswer';

interface DealBreaker {
  value: string;
  severity: 'hard' | 'soft';
}

interface Candidate {
  id: string;
  name: string;
  bio?: string;
  traits?: string[];
}

interface MatchPreviewCardProps {
  userDealBreakers: DealBreaker[];
  candidate: Candidate;
  onOpenProfile: (candidate: Candidate) => void;
}

export default function MatchPreviewCard({
  userDealBreakers,
  candidate,
  onOpenProfile,
}: MatchPreviewCardProps) {
  const [violations, setViolations] = useState<DealBreaker[]>([]);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const matchTraits = candidate.traits || [];

  useEffect(() => {
    if (!userDealBreakers || !candidate) return;

    const conflicts = userDealBreakers
      .filter((db) => db.severity === 'hard')
      .filter((db) =>
        matchTraits.some((trait) =>
          trait.toLowerCase().includes(db.value.split(' ')[0].toLowerCase())
        )
      );

    if (conflicts.length > 0) {
      setViolations(conflicts);
      onOpen();
    }
  }, [candidate, userDealBreakers, onOpen]);

  const handleAccept = () => {
    onClose();
    onOpenProfile(candidate);
  };

  const handleReject = () => {
    onClose();
    saveAnswer('skippedMatchDueToRedFlag', candidate.id);
  };

  return (
    <Box
      bg="white"
      border="1px"
      borderColor="gray.100"
      borderRadius="xl"
      boxShadow="md"
      p={6}
      position="relative"
    >
      <Heading size="md" color="pink.500">
        {candidate.name}
      </Heading>
      <Text fontSize="sm" color="gray.700" mt={2}>
        {candidate.bio || 'No bio provided.'}
      </Text>

      <Button
        mt={4}
        colorScheme="blue"
        onClick={handleAccept}
        variant="solid"
      >
        View Profile →
      </Button>

      {isOpen && (
        <MatchConflictWarningModal
          violations={violations}
          onAccept={handleAccept}
          onReject={handleReject}
        />
      )}
    </Box>
  );
}
