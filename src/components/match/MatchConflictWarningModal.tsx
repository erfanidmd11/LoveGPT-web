import React from 'react';
import {
  Box,
  Text,
  Heading,
  VStack,
  HStack,
  Button,
  useColorModeValue,
  List,
  ListItem,
  ListIcon,
} from '@chakra-ui/react';
import { WarningIcon } from '@chakra-ui/icons';

interface Violation {
  value: string;
}

interface MatchConflictWarningModalProps {
  violations: Violation[];
  onAccept: () => void;
  onReject: () => void;
}

export default function MatchConflictWarningModal({
  violations,
  onAccept,
  onReject,
}: MatchConflictWarningModalProps) {
  const bg = useColorModeValue('white', 'gray.800');
  const overlayBg = 'rgba(0, 0, 0, 0.5)';

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      bottom={0}
      zIndex={50}
      bg={overlayBg}
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Box
        bg={bg}
        p={6}
        rounded="xl"
        shadow="xl"
        w="full"
        maxW="md"
      >
        <VStack align="start" spacing={4}>
          <Heading size="md" color="red.500">
            Heads up 🛑
          </Heading>

          <Text fontSize="sm" color="gray.700">
            This person has traits that conflict with your hard deal breakers:
          </Text>

          <List spacing={1} pl={4} color="red.500" fontSize="sm">
            {violations.map((v, idx) => (
              <ListItem key={idx}>
                <ListIcon as={WarningIcon} color="red.400" />
                {v.value}
              </ListItem>
            ))}
          </List>

          <Text fontSize="xs" color="gray.400" fontStyle="italic">
            These flags were added based on your preferences. You can choose to proceed or skip this match.
          </Text>

          <HStack justify="end" w="full" pt={2}>
            <Button
              onClick={onReject}
              size="sm"
              variant="outline"
              colorScheme="gray"
            >
              Skip Match
            </Button>
            <Button
              onClick={onAccept}
              size="sm"
              colorScheme="pink"
            >
              View Anyway
            </Button>
          </HStack>
        </VStack>
      </Box>
    </Box>
  );
}
