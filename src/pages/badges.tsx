// src/pages/badges.tsx
import Head from 'next/head';
import MainLayout from '@/layouts/MainLayout';
import {
  Box, Heading, SimpleGrid, VStack, Image, Text, useColorModeValue
} from '@chakra-ui/react';

const badges = [
  {
    name: 'Seed Planter',
    emoji: '🌱',
    image: '/seed-planter.png',
    threshold: 1,
    description: 'You’ve planted your first seed of love with your first referral.'
  },
  {
    name: 'Spark Spreader',
    emoji: '💞',
    image: '/spark-spreader.png',
    threshold: 3,
    description: 'You’re spreading light and connection with 3 successful referrals.'
  },
  {
    name: "Cupid's Assistant",
    emoji: '💌',
    image: '/cupids-assistant.png',
    threshold: 5,
    description: 'Your matchmaking skills are glowing — 5 referrals strong!'
  },
  {
    name: 'Matchmaker Elite',
    emoji: '💖',
    image: '/matchmaker-elite.png',
    threshold: 10,
    description: 'You’ve helped create deep connections — 10+ successful referrals.'
  },
  {
    name: 'LoveGPT Luminary',
    emoji: '🧠',
    image: '/lovegpt-luminary.png',
    threshold: 20,
    description: 'You are a community influencer — 20+ people have joined through you.'
  }
];

export default function BadgePage() {
  const bg = useColorModeValue('white', 'gray.800');

  return (
    <MainLayout>
      <Head>
        <title>Badge Tiers | LoveGPT</title>
      </Head>
      <Box maxW="5xl" mx="auto" px={6} py={16}>
        <Heading size="lg" mb={6} color="pink.600" textAlign="center">
          🎖 LoveGPT Referral Badge Tiers
        </Heading>

        <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={6}>
          {badges.map((badge) => (
            <Box
              key={badge.name}
              p={6}
              borderRadius="xl"
              bg={bg}
              shadow="md"
              border="1px solid"
              borderColor="gray.100"
              textAlign="center"
            >
              <Image src={badge.image} alt={badge.name} boxSize="60px" mx="auto" mb={3} />
              <Text fontWeight="bold" fontSize="lg" color="pink.600">
                {badge.emoji} {badge.name}
              </Text>
              <Text fontSize="sm" mt={1} color="gray.600">
                {badge.description}
              </Text>
              <Text fontSize="xs" mt={2} color="gray.400">
                {badge.threshold}+ referrals
              </Text>
            </Box>
          ))}
        </SimpleGrid>
      </Box>
    </MainLayout>
  );
}
