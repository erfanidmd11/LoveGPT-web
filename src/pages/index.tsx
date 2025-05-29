import { useState, useEffect } from 'react';
import Head from 'next/head';
import MainLayout from '@/layouts/MainLayout';
import WaitlistRequestModal from '@/components/onboarding/WaitlistRequestModal';
import {
  Box,
  Button,
  Center,
  Heading,
  SimpleGrid,
  Text,
  VStack,
} from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import { motion } from 'framer-motion';
import Marquee from 'react-fast-marquee';
import dynamic from 'next/dynamic';

const ParticleBackground = dynamic(() => import('@/components/ParticleBackground'), { ssr: false });

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const MotionBox = motion(Box);

export default function Home() {
  const [showWaitlistModal, setShowWaitlistModal] = useState(false);
  const handleJoinClick = () => setShowWaitlistModal(true);

  return (
    <MainLayout>
      <Head>
        <title>LoveGPT — Emotional Operating System for Relationships</title>
        <meta name="description" content="The world's first Relationship Readiness AI that grows with you." />
      </Head>

      {/* Hero Section */}
      <Box
        position="relative"
        bgGradient="linear(to-br, pink.50, purple.100)"
        pt={0}
        pb={16}
        mt={0}
        textAlign="center"
        minH="100vh"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        overflow="hidden"
      >
        <Box position="absolute" top={0} left={0} right={0} bottom={0} zIndex={0}>
          <ParticleBackground />
        </Box>
        <Box position="relative" zIndex={1}>
          <Heading as="h1" fontSize="5xl" fontWeight="extrabold" color="gray.800" mb={4}>
            LoveGPT is NOT a dating app.
          </Heading>
          <Text fontSize="lg" color="gray.600" maxW="3xl" mx="auto" mb={6}>
            It’s the world’s first Emotional Operating System for Relationships — guiding you through self-discovery 🧠, soul-aligned love ❤️, and lifelong evolution 🌎✨.
          </Text>
          <Button
            onClick={handleJoinClick}
            bgGradient="linear(to-r, pink.400, purple.500)"
            color="white"
            px={8}
            py={6}
            rounded="full"
            fontSize="xl"
            fontWeight="bold"
            boxShadow="lg"
            _hover={{ bg: 'pink.600' }}
          >
            Join the Waitlist Now
          </Button>
        </Box>
      </Box>

      {/* Why LoveGPT */}
      <Box bg="white" py={20} px={6}>
        <Heading textAlign="center" size="xl" color="blue.600" mb={6}>
          Why LoveGPT?
        </Heading>
        <VStack spacing={6} maxW="4xl" mx="auto" fontSize="lg" color="gray.700">
          <Text>Most people jump into dating or relationships without knowing what to look for — or what to avoid. We match, we hope, we guess. And when things fall apart, we blame bad luck.</Text>
          <Text>But love isn’t luck. It’s an emotional skillset. And LoveGPT was built to teach you how to master it.</Text>
          <Text>Through ARIA — your AI-powered mentor, mirror, and protector — you’ll uncover blind spots, understand how you communicate, and identify what truly aligns with your soul.</Text>
          <Text>Imagine never again second-guessing a text, a conversation, or your own intuition. Imagine being guided by a loving, non-judgmental presence that’s deeply aligned with who you are and who you want to be.</Text>
          <Text>This is what LoveGPT unlocks — not just a match, but mastery.</Text>
          <Button
            onClick={handleJoinClick}
            mt={4}
            bgGradient="linear(to-r, blue.500, teal.400)"
            _hover={{ bg: 'blue.600' }}
            color="white"
            px={8}
            py={4}
            rounded="xl"
            fontSize="lg"
            fontWeight="bold"
          >
            I’m Ready to Evolve
          </Button>
        </VStack>
      </Box>

      {/* Transformation Journey */}
      <Box bgGradient="linear(to-br, blue.50, pink.50)" py={20} px={6}>
        <Heading textAlign="center" size="xl" color="purple.600" mb={6}>
          Your Journey. Guided by ARIA.
        </Heading>
        <Text textAlign="center" maxW="3xl" mx="auto" fontSize="lg" color="gray.700" mb={10}>
          LoveGPT helps you evolve — from who you are, to who you’re meant to be in love and life.
        </Text>
        <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8} maxW="5xl" mx="auto" textAlign="center">
          <VStack spacing={2}><Text fontSize="2xl">🧠</Text><Text fontWeight="semibold">Self-Discovery</Text><Text fontSize="sm">Understand your emotional blueprint.</Text></VStack>
          <VStack spacing={2}><Text fontSize="2xl">❤️</Text><Text fontWeight="semibold">Soul-Aligned Dating</Text><Text fontSize="sm">Connect through values and depth.</Text></VStack>
          <VStack spacing={2}><Text fontSize="2xl">💍</Text><Text fontWeight="semibold">Conscious Partnership</Text><Text fontSize="sm">Grow with deep compatibility.</Text></VStack>
          <VStack spacing={2}><Text fontSize="2xl">👶🏡</Text><Text fontWeight="semibold">Parenthood & Legacy</Text><Text fontSize="sm">Create a foundation for future generations.</Text></VStack>
          <VStack spacing={2}><Text fontSize="2xl">🌎✨</Text><Text fontWeight="semibold">Lifelong Evolution</Text><Text fontSize="sm">Never stop growing — personally and together.</Text></VStack>
        </SimpleGrid>
        <Center mt={10}>
          <Button
            onClick={handleJoinClick}
            bgGradient="linear(to-r, purple.500, pink.400)"
            color="white"
            px={8}
            py={4}
            rounded="xl"
            fontSize="lg"
            fontWeight="bold"
          >
            Start Your Journey
          </Button>
        </Center>
      </Box>

      {/* Real People. Real Shifts. */}
      <Box bg="gray.50" py={20} px={6}>
        <Heading textAlign="center" size="xl" color="pink.600" mb={6}>
          Real People. Real Shifts.
        </Heading>
        <VStack spacing={12} maxW="4xl" mx="auto" fontSize="md" color="gray.700" textAlign="center">
          <Text>“I got early access during the Alpha launch. I didn’t even know how emotionally unready I was... This isn’t a dating app — it’s a personal transformation.” — Jenna A., 34</Text>
          <Text>“LoveGPT, and ARIA, helped us understand ourselves. We now communicate with depth and truth.” — Marcus & Talia</Text>
          <Text>“I used to jump from situationship to situationship. Now I know who I am — and what I need.” — Dave, 29</Text>
        </VStack>
        <Center mt={10}>
          <Button
            onClick={handleJoinClick}
            bgGradient="linear(to-r, pink.400, purple.500)"
            color="white"
            px={8}
            py={4}
            rounded="xl"
            fontSize="lg"
            fontWeight="bold"
          >
            Join the Next-Level Launch
          </Button>
        </Center>
      </Box>

      {/* Tokenization & Growth Panel */}
      <MotionBox
        bgGradient="linear(to-br, gray.50, teal.50)"
        py={20}
        px={6}
        animation={`${fadeIn} 1s ease-in-out`}
      >
        <Heading textAlign="center" size="xl" color="teal.700" mb={6}>
          Growth That Rewards You
        </Heading>
        <VStack spacing={6} maxW="4xl" mx="auto" fontSize="lg" color="gray.800" textAlign="center">
          <Text>As you evolve, you earn tokens — which unlock premium features, 1:1 coaching with mentors, and exclusive insights.</Text>
          <Text>Refer others, grow your impact — and build your emotional currency by becoming your best self.</Text>
          <Button
            onClick={handleJoinClick}
            mt={4}
            bgGradient="linear(to-r, teal.400, green.500)"
            _hover={{ bg: 'teal.600' }}
            color="white"
            px={8}
            py={4}
            rounded="xl"
            fontSize="lg"
            fontWeight="bold"
          >
            Earn By Growing
          </Button>
        </VStack>
      </MotionBox>

      {/* Scrolling Testimonials */}
      <Box bg="gray.100" py={12} px={4}>
        <Marquee pauseOnHover gradient={false} speed={40}>
          <Text mx={8} fontSize="md" color="gray.700" fontStyle="italic">
            “ARIA helped me recognize emotional blind spots I didn’t know existed.” — Olivia, 31
          </Text>
          <Text mx={8} fontSize="md" color="gray.700" fontStyle="italic">
            “This isn’t dating — this is transformation.” — Julian, 27
          </Text>
          <Text mx={8} fontSize="md" color="gray.700" fontStyle="italic">
            “It’s like therapy in real time — but smarter.” — Dave, 29
          </Text>
        </Marquee>
      </Box>

      {/* FOMO Final CTA */}
      <MotionBox
        bgGradient="linear(to-br, pink.100, purple.100)"
        py={24}
        px={6}
        textAlign="center"
        animation={`${fadeIn} 1.5s ease-in-out`}
      >
        <Heading as="h2" size="2xl" fontWeight="extrabold" color="pink.700" mb={6}>
          This isn’t for everyone.
        </Heading>
        <Text fontSize="lg" color="gray.700" maxW="3xl" mx="auto" mb={8}>
          LoveGPT is invitation-only. We’re rolling out in waves — to protect intimacy, ensure aligned users, and cultivate a conscious community.
        </Text>
        <Text fontSize="lg" color="gray.700" maxW="3xl" mx="auto" mb={6}>
          The earlier you join, the sooner you’ll be guided by ARIA and invited to become a certified mentor.
        </Text>
        <Button
          onClick={handleJoinClick}
          bgGradient="linear(to-r, pink.500, red.400)"
          color="white"
          px={10}
          py={6}
          rounded="full"
          fontSize="xl"
          fontWeight="bold"
          boxShadow="2xl"
          _hover={{ bg: 'pink.600' }}
        >
          Get Invited — Join the Waitlist Now
        </Button>
      </MotionBox>

      <WaitlistRequestModal isOpen={showWaitlistModal} onClose={() => setShowWaitlistModal(false)} />
    </MainLayout>
  );
}
