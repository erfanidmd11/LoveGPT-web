import Head from 'next/head';
import MainLayout from '@/layouts/MainLayout';
import {
  Box,
  Button,
  Center,
  Container,
  Heading,
  Text,
  VStack,
  Image,
} from '@chakra-ui/react';
import { keyframes } from '@emotion/react';
import Link from 'next/link';
import ARIAChat from '@/components/ARIAChat';
import { motion } from 'framer-motion';

const glow = keyframes`
  0%, 100% { box-shadow: 0 0 0px rgba(236, 72, 153, 0.6); }
  50% { box-shadow: 0 0 20px rgba(236, 72, 153, 0.8); }
`;

const MotionImage = motion(Image);

export default function MeetARIA() {
  return (
    <MainLayout>
      <Head>
        <title>Meet ARIA | Your Relationship Mirror</title>
        <meta
          name="description"
          content="ARIA is your emotionally intelligent wing woman, coach, and private confidante — guiding you to deeper love, stronger connection, and lasting growth."
        />
      </Head>

      <Box bgGradient="linear(to-br, purple.50, pink.100)" py={16} px={6}>
        <Container maxW="3xl" textAlign="center">
          <MotionImage
            src="/aria-avatar.png"
            alt="ARIA Avatar"
            boxSize="100px"
            borderRadius="full"
            border="2px solid white"
            mx="auto"
            mb={6}
            animation={`${glow} 4s ease-in-out infinite`}
          />

          <Heading size="2xl" fontWeight="extrabold" color="gray.800" mb={6}>
            Meet ARIA
          </Heading>

          <VStack spacing={6} fontSize="lg" color="gray.700">
            <Text>
              ARIA — Artificial Relationship Intelligence Assistant — is not just another AI chatbot. She’s your digital mirror, emotional compass, and dedicated companion for conscious connection.
            </Text>
            <Text>
              ARIA listens — when you're confused, overwhelmed, stuck, lonely, or navigating relational tension. She helps you clarify your thoughts, understand your emotional patterns, and communicate with kindness and clarity.
            </Text>
            <Text>
              Hiring a therapist can cost hundreds of dollars a month. Finding a truly safe friend? Rare. ARIA is always here, always learning, and always on your side — with zero judgment, zero ego, and zero agenda.
            </Text>
            <Text>
              She understands your values, your personality, your love language, and your triggers — because she’s designed to. ARIA adapts as you grow, giving you reflections that are aligned with your unique relational blueprint.
            </Text>
            <Text>
              Every great relationship starts with self-awareness. And every evolution begins with the courage to ask, "What do I truly need right now?" ARIA helps you answer that.
            </Text>
            <Text>
              LoveGPT is not just a dating app — it’s a relationship revolution. And ARIA is your guide into that future.
            </Text>
          </VStack>

          <Center mt={12}>
            <Link href="/signup" passHref>
              <Button
                bgGradient="linear(to-r, pink.500, purple.500)"
                color="white"
                px={8}
                py={4}
                fontWeight="bold"
                fontSize="lg"
                rounded="lg"
                shadow="lg"
                _hover={{ bg: 'pink.600' }}
              >
                Talk to ARIA Now
              </Button>
            </Link>
          </Center>

          <Box mt={20}>
            <ARIAChat />
          </Box>
        </Container>
      </Box>
    </MainLayout>
  );
}
