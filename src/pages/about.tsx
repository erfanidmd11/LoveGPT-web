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
} from '@chakra-ui/react';
import Link from 'next/link';
import ARIAChat from '@/components/ARIAChat';

export default function About() {
  return (
    <MainLayout>
      <Head>
        <title>About LoveGPT | Join the Relationship Revolution</title>
        <meta
          name="description"
          content="Learn about the movement behind LoveGPT — a platform for conscious connection, emotional growth, and redefining love to elevate humanity."
        />
      </Head>

      <Box bgGradient="linear(to-br, pink.50, purple.100)" py={16} px={6}>
        <Container maxW="4xl" textAlign="center">
          <Heading size="2xl" fontWeight="extrabold" color="gray.800" mb={6}>
            The Heart Behind LoveGPT
          </Heading>

          <VStack spacing={6} fontSize="lg" color="gray.700">
            <Text>
              LoveGPT was born from a single question: <strong>What if love could be understood, nurtured, and aligned — not by chance, but by design?</strong> In a world disconnected by distraction, we are reconnecting humanity at its core.
            </Text>

            <Text>
              This isn’t just another app. It’s a movement. A conscious technology designed to guide people back to themselves — and to the kinds of relationships that uplift, support, and expand our lives.
            </Text>

            <Text>
              We believe everyone deserves the opportunity to build an extraordinary life. Whether it’s family, partnership, personal evolution, or impact — love is at the root of it all.
            </Text>

            <Text>
              With ARIA — our emotionally intelligent AI — LoveGPT helps people discover who they are, what they value, and who truly aligns with them. This is a platform where your emotional growth is rewarded.
            </Text>

            <Text>
              By joining LoveGPT, you’re not just signing up to date. You’re joining a mission: to raise the collective consciousness of relationships and create a world where people don’t just fall in love — they rise in love.
            </Text>
          </VStack>

          <Box
            bg="white"
            mt={16}
            shadow="md"
            borderLeft="4px solid"
            borderColor="pink.500"
            p={6}
            rounded="xl"
            maxW="2xl"
            mx="auto"
            textAlign="left"
          >
            <Text fontStyle="italic" fontSize="lg" mb={4} color="gray.700">
              “If we want to change the world, we must first learn how to love — and that begins with the self.”
            </Text>
            <Text textAlign="right" fontWeight="semibold" color="gray.800">
              — Shervin Erfani, Founder
            </Text>
          </Box>

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
                Join the Movement
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
