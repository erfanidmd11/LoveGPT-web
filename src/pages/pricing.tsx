import Head from 'next/head';
import MainLayout from '@/layouts/MainLayout';
import {
  Box,
  Button,
  Container,
  Heading,
  HStack,
  SimpleGrid,
  Text,
  VStack,
  useColorModeValue,
  useBreakpointValue,
  Switch,
} from '@chakra-ui/react';
import Link from 'next/link';
import { useState } from 'react';
import ARIAChat from '@/components/ARIAChat';

export default function Pricing() {
  const [annual, setAnnual] = useState(false);

  const pricing = {
    starter: { monthly: 0, annual: 0 },
    growth: { monthly: 19, annual: 190 },
    legacy: { monthly: 49, annual: 490 },
  };

  return (
    <MainLayout>
      <Head>
        <title>LoveGPT Pricing | Conscious Love, Tailored for You</title>
        <meta
          name="description"
          content="Explore LoveGPT's transparent pricing. Invest in a relationship platform that grows with you."
        />
      </Head>

      <Box bgGradient="linear(to-br, indigo.50, pink.50)" py={16} px={6}>
        <Container maxW="6xl" textAlign="center">
          <Heading size="2xl" mb={6} fontWeight="extrabold" color="gray.800">
            Pricing Plans
          </Heading>
          <Text maxW="2xl" mx="auto" mb={10} fontSize="lg" color="gray.600">
            We believe true connection should be accessible — that’s why LoveGPT offers a tiered model to support growth at every stage.
          </Text>

          <HStack justifyContent="center" mb={12} fontSize="md" color="gray.700">
            <Text fontWeight={!annual ? 'bold' : 'normal'} color={!annual ? 'indigo.600' : 'gray.500'}>Monthly</Text>
            <Switch
              isChecked={annual}
              onChange={() => setAnnual(!annual)}
              colorScheme="pink"
            />
            <Text fontWeight={annual ? 'bold' : 'normal'} color={annual ? 'indigo.600' : 'gray.500'}>
              Annual (Save 20%)
            </Text>
          </HStack>

          <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
            {['starter', 'growth', 'legacy'].map((plan) => (
              <Box
                key={plan}
                bg="white"
                p={8}
                rounded="xl"
                shadow="md"
                borderTop="4px solid"
                borderColor={{
                  starter: 'green.400',
                  growth: 'indigo.500',
                  legacy: 'purple.500',
                }[plan]}
              >
                <Heading size="md" mb={2}>
                  {plan === 'starter' ? 'Starter' : plan === 'growth' ? 'Growth' : 'Legacy'}
                </Heading>
                <Text fontSize="sm" color="gray.600" mb={4}>
                  {plan === 'starter' ? 'Free forever' : `$${annual ? pricing[plan].annual : pricing[plan].monthly}/${annual ? 'year' : 'month'}`}
                </Text>
                <VStack align="start" spacing={2} fontSize="sm" color="gray.700" mb={6}>
                  {plan === 'starter' && [
                    'Core onboarding experience',
                    'Basic compatibility insights',
                    'ARIA access (limited daily)',
                    'Earn token rewards',
                  ].map((item, i) => <Text key={i}>• {item}</Text>)}
                  {plan === 'growth' && [
                    'Unlimited ARIA reflections',
                    'Advanced compatibility metrics',
                    'Weekly coaching & insights',
                    'Gamified growth dashboard',
                  ].map((item, i) => <Text key={i}>• {item}</Text>)}
                  {plan === 'legacy' && [
                    'Everything in Growth',
                    'Access to certified Love Mentors',
                    'Private circles & workshops',
                    'Max token rewards & ambassador status',
                  ].map((item, i) => <Text key={i}>• {item}</Text>)}
                </VStack>
                <Link href="/signup">
                  <Button colorScheme={{
                    starter: 'green',
                    growth: 'indigo',
                    legacy: 'purple',
                  }[plan]} width="full">
                    {plan === 'starter' ? 'Get Started' : plan === 'growth' ? 'Upgrade Now' : 'Join Legacy Tier'}
                  </Button>
                </Link>
              </Box>
            ))}
          </SimpleGrid>

          <Box mt={20} maxW="3xl" mx="auto">
            <Heading size="lg" color="gray.800" mb={6}>
              What Our Users Are Saying
            </Heading>
            <VStack spacing={4} fontSize="md" color="gray.600">
              <Text fontStyle="italic">
                “ARIA helped me see myself clearly and show up better in my relationship. It’s like having a wise best friend in my pocket.”
              </Text>
              <Text fontStyle="italic">
                “I didn’t think AI could feel so human. I’ve grown more emotionally in 3 months with LoveGPT than I did in 3 years of dating.”
              </Text>
            </VStack>
          </Box>

          <Box mt={20} maxW="2xl" mx="auto" textAlign="center">
            <Heading size="md" mb={4}>Not Sure Which Plan Is Right for You?</Heading>
            <Text color="gray.600" mb={4}>
              Ask ARIA — she’ll guide you based on your needs, goals, and stage in your love journey.
            </Text>
            <ARIAChat />
          </Box>
        </Container>
      </Box>
    </MainLayout>
  );
}
