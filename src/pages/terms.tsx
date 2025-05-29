import Head from 'next/head';
import MainLayout from '@/layouts/MainLayout';
import { Box, Heading, Text, VStack, Link, Container } from '@chakra-ui/react';

export default function TermsOfUse() {
  return (
    <MainLayout>
      <Head>
        <title>Terms of Use | LoveGPT</title>
        <meta
          name="description"
          content="Read the terms of service for LoveGPT. Learn your rights and responsibilities when using our emotionally intelligent relationship platform."
        />
      </Head>

      <Box
        bgGradient="linear(to-br, white, purple.50)"
        py={{ base: 12, md: 20 }}
        px={6}
      >
        <Container maxW="3xl">
          <Heading
            textAlign="center"
            fontSize={{ base: '3xl', md: '4xl' }}
            fontWeight="extrabold"
            color="gray.800"
            mb={10}
          >
            Terms of Use
          </Heading>

          <VStack spacing={8} align="start" fontSize="lg" color="gray.700">
            <Text><strong>Effective Date:</strong> [Insert Date]</Text>

            <Text>
              Welcome to LoveGPT. By accessing or using our platform at{' '}
              <Link href="https://www.thelovegpt.ai" color="pink.600" isExternal>
                www.thelovegpt.ai
              </Link>, you agree to be bound by the following Terms of Use.
            </Text>

            <Box>
              <Heading size="md" mb={2}>1. Eligibility</Heading>
              <Text>You must be at least 18 years old to use LoveGPT...</Text>
            </Box>

            <Box>
              <Heading size="md" mb={2}>2. Purpose of the Platform</Heading>
              <Text>
                LoveGPT is an AI-powered platform designed to support emotional growth...
              </Text>
            </Box>

            <Box>
              <Heading size="md" mb={2}>3. User Responsibilities</Heading>
              <Text>You agree to use LoveGPT with integrity...</Text>
              <ul style={{ paddingLeft: '1.2rem', listStyle: 'disc' }}>
                <li>Do not use the platform for unlawful purposes</li>
                <li>No harassment, impersonation, or abuse</li>
                <li>No uploading offensive content</li>
                <li>No reverse-engineering LoveGPT's AI</li>
              </ul>
            </Box>

            <Box>
              <Heading size="md" mb={2}>4. Intellectual Property</Heading>
              <Text>All content is owned by LoveGPT and may not be reused...</Text>
            </Box>

            <Box>
              <Heading size="md" mb={2}>5. Privacy & Security</Heading>
              <Text>
                See our{' '}
                <Link href="/privacy" color="pink.600">
                  Privacy Policy
                </Link>. We do not store conversations unless stated.
              </Text>
            </Box>

            <Box>
              <Heading size="md" mb={2}>6. Termination</Heading>
              <Text>We may suspend or terminate accounts without notice for violations.</Text>
            </Box>

            <Box>
              <Heading size="md" mb={2}>7. Disclaimer</Heading>
              <Text>
                LoveGPT is exploratory AI. Use it at your own discretion. No guarantees.
              </Text>
            </Box>

            <Box>
              <Heading size="md" mb={2}>8. Limitation of Liability</Heading>
              <Text>
                LoveGPT is not liable for emotional or relational outcomes...
              </Text>
            </Box>

            <Box>
              <Heading size="md" mb={2}>9. Changes to Terms</Heading>
              <Text>
                Terms may change. Continued use means acceptance of the new terms.
              </Text>
            </Box>

            <Box>
              <Heading size="md" mb={2}>10. Contact Us</Heading>
              <Text>
                Email:{' '}
                <Link href="mailto:team@thelovegpt.ai" color="pink.600">
                  team@thelovegpt.ai
                </Link>
              </Text>
              <Text>
                Website:{' '}
                <Link href="https://www.thelovegpt.ai" color="pink.600" isExternal>
                  www.thelovegpt.ai
                </Link>
              </Text>
            </Box>

            <Text
              fontSize="md"
              textAlign="center"
              fontStyle="italic"
              color="gray.600"
              mt={10}
              w="full"
            >
              Conscious love begins with conscious agreement. Thank you for showing up with intention.
            </Text>
          </VStack>
        </Container>
      </Box>
    </MainLayout>
  );
}
