// src/pages/index.tsx
import { useState } from 'react';
import Head from 'next/head';
import MainLayout from '@/layouts/MainLayout';
import ARIAChat from '@/components/ARIAChat';
import InvitationModal from '@/components/InvitationModal';
import {
  Box,
  Button,
  Center,
  Heading,
  Stack,
  Text,
  VStack,
  useDisclosure,
  Highlight,
} from '@chakra-ui/react';

export default function Home() {
  const [showInviteModal, setShowInviteModal] = useState(false);

  const handleJoinClick = () => setShowInviteModal(true);

  return (
    <MainLayout>
      <Head>
        <title>LoveGPT — Emotional Operating System for Relationships</title>
        <meta
          name="description"
          content="The world's first Relationship Readiness AI that grows with you."
        />
      </Head>

      {/* Hero Section */}
      <Box bgGradient="linear(to-br, pink.50, purple.100)" py={16} textAlign="center">
        <Heading as="h1" fontSize="5xl" fontWeight="extrabold" color="gray.800" mb={4}>
          Welcome to <Text as="span" color="pink.500">Love</Text>
          <Text as="span" color="blue.500">GPT</Text>
        </Heading>

        <Text fontSize="lg" color="gray.600" maxW="3xl" mx="auto" mb={6}>
          LoveGPT is your Emotional Operating System for Relationships. Powered by AI. Rooted in consciousness. More than dating. More than therapy. ARIA helps you reflect, grow, and prepare for deep, lasting connections and love.
        </Text>

        <Button
          onClick={handleJoinClick}
          bg="pink.500"
          color="white"
          px={8}
          py={6}
          rounded="xl"
          fontSize="xl"
          fontWeight="bold"
          boxShadow="md"
          _hover={{ bg: 'pink.600' }}
        >
          Start Your Journey
        </Button>

        <Text fontSize="sm" color="gray.500" mt={4}>
          Already have an account?{' '}
          <Button variant="link" colorScheme="blue" onClick={handleJoinClick}>
            Log In
          </Button>
        </Text>

        <Box
          bg="white"
          border="1px solid"
          borderColor="pink.100"
          shadow="lg"
          p={4}
          rounded="xl"
          w="full"
          maxW="md"
          mx="auto"
          mt={10}
        >
          <Text fontSize="sm" color="gray.500">
            “From first reflection to first kiss — I’m here for it all.” —{' '}
            <Text as="span" color="pink.500" fontWeight="semibold">ARIA</Text>
          </Text>
          <Text fontSize="xs" color="gray.400" mt={2}>
            ARIA stands for Artificial Relationship Intelligence Assistant — your emotional mirror and growth companion.
          </Text>
        </Box>

        {/* Tailwind Verification Box Equivalents */}
        <VStack spacing={4} mt={6}>
          <Box bg="green.500" color="white" p={4} rounded="xl" shadow="lg">
            ✅ Tailwind is working perfectly!
          </Box>
          <Box bg="yellow.400" color="black" p={4} rounded="lg" shadow="md">
            ✅ Tailwind is LIVE and styling your app!
          </Box>
        </VStack>
      </Box>

      {/* Why LoveGPT Section */}
      <Box bg="white" py={20} px={6}>
        <Heading textAlign="center" size="xl" color="pink.600" mb={6}>
          Why LoveGPT?
        </Heading>
        <VStack spacing={6} maxW="3xl" mx="auto" fontSize="lg" color="gray.700">
          <Text>Let’s be honest — most dating apps match you based on photos and one-liners. But what happens when the chemistry fades?</Text>
          <Text>LoveGPT is different. We help you date from the inside out.</Text>
          <Text>Imagine finishing a confusing date, and ARIA says: “You abandoned your boundary here. Want help practicing what to say next time?”</Text>
          <Text>You’ll get a Relationship Readiness Score. Earn tokens as you grow. No shame. Just growth.</Text>
          <Button
            onClick={handleJoinClick}
            mt={4}
            bg="blue.600"
            _hover={{ bg: 'blue.700' }}
            color="white"
            px={6}
            py={3}
            rounded="xl"
          >
            Unlock Conscious Love
          </Button>
        </VStack>
      </Box>

      {/* Testimonials */}
      <Box bg="gray.50" py={20} px={6}>
        <Heading textAlign="center" size="xl" color="pink.600" mb={6}>
          Real People. Real Shifts.
        </Heading>
        <Center maxW="4xl" mx="auto">
          <Stack spacing={8} direction={{ base: 'column', md: 'row' }} textAlign="center" fontSize="sm" color="gray.600">
            <Text>“ARIA helped me say what I actually feel.” — Jenna, 34</Text>
            <Text>“Now we communicate with depth.” — Marcus & Talia</Text>
            <Text>“It’s like therapy in real time.” — Dave, 29</Text>
          </Stack>
        </Center>
        <Center mt={8}>
          <Button
            onClick={handleJoinClick}
            bg="pink.500"
            _hover={{ bg: 'pink.600' }}
            color="white"
            px={6}
            py={3}
            rounded="xl"
          >
            I’m Ready to Grow
          </Button>
        </Center>
      </Box>

      {/* Elevator Pitch */}
      <Box bg="white" py={20} px={6}>
        <Heading textAlign="center" size="xl" color="blue.600" mb={6}>
          What Is LoveGPT, Really?
        </Heading>
        <VStack maxW="3xl" mx="auto" spacing={6} fontSize="lg" color="gray.700">
          <Text>LoveGPT is the world’s first Relationship Readiness AI.</Text>
          <Text>Whether you're dating, healing, married, or in-between — ARIA grows with you.</Text>
          <Text fontStyle="italic">
            "Imagine if Grammarly and a therapist had a baby — and she coached your love life."
          </Text>
          <Button
            onClick={handleJoinClick}
            mt={4}
            bg="purple.600"
            _hover={{ bg: 'purple.700' }}
            color="white"
            px={8}
            py={4}
            rounded="xl"
            fontSize="lg"
            fontWeight="semibold"
          >
            Apply for Invitation
          </Button>
        </VStack>
      </Box>

      <ARIAChat />

      {showInviteModal && (
        <InvitationModal onClose={() => setShowInviteModal(false)} />
      )}
    </MainLayout>
  );
}
