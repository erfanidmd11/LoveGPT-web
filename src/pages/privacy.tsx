import Head from 'next/head';
import MainLayout from '@/layouts/MainLayout';
import { Box, Heading, Text, VStack, Link, Container } from '@chakra-ui/react';

export default function PrivacyPolicy() {
  return (
    <MainLayout>
      <Head>
        <title>Privacy Policy | LoveGPT</title>
        <meta
          name="description"
          content="Learn how LoveGPT protects your data and respects your emotional privacy. No tracking, no chat logs, and full user control."
        />
      </Head>

      <Box bgGradient="linear(to-br, white, pink.50)" py={{ base: 12, md: 20 }} px={6}>
        <Container maxW="3xl">
          <Heading
            textAlign="center"
            fontSize={{ base: '3xl', md: '4xl' }}
            fontWeight="extrabold"
            color="gray.800"
            mb={10}
          >
            Privacy Policy
          </Heading>

          <VStack spacing={8} align="start" fontSize="lg" color="gray.700">
            <Text><strong>Effective Date:</strong> [Insert Date]</Text>

            <Text>
              At LoveGPT, your trust means everything to us. This Privacy Policy explains how we collect, use, and protect your information when you use our services — including our emotionally intelligent AI guide, ARIA.
            </Text>

            <Box>
              <Heading size="md" mb={2}>1. Your Privacy, Your Power</Heading>
              <Text>
                We believe that emotional safety is foundational to conscious love. That’s why <strong>LoveGPT does not store, transmit, or sell your private conversations</strong>. What you share with ARIA stays with you — always.
              </Text>
            </Box>

            <Box>
              <Heading size="md" mb={2}>2. Information We Collect</Heading>
              <ul style={{ paddingLeft: '1.2rem', listStyle: 'disc' }}>
                <li><strong>Account Info:</strong> Name, email, phone number (optional)</li>
                <li><strong>Usage Data:</strong> Anonymized interaction metadata</li>
              </ul>
            </Box>

            <Box>
              <Heading size="md" mb={2}>3. What We Don’t Collect</Heading>
              <ul style={{ paddingLeft: '1.2rem', listStyle: 'disc' }}>
                <li>No voice recordings</li>
                <li>No chat logs by default</li>
                <li>No GPS tracking</li>
                <li>No third-party ad tracking</li>
              </ul>
            </Box>

            <Box>
              <Heading size="md" mb={2}>4. How Your Data Is Used</Heading>
              <ul style={{ paddingLeft: '1.2rem', listStyle: 'disc' }}>
                <li>Personalize ARIA’s responses</li>
                <li>Understand usage trends</li>
                <li>Securely authenticate your account</li>
              </ul>
              <Text mt={2}><strong>We never sell or share your data with advertisers.</strong></Text>
            </Box>

            <Box>
              <Heading size="md" mb={2}>5. Data Security</Heading>
              <Text>
                We use encryption, secure cloud architecture, and modern protocols — including quantum-resistant methods — to protect your information.
              </Text>
            </Box>

            <Box>
              <Heading size="md" mb={2}>6. Your Rights</Heading>
              <ul style={{ paddingLeft: '1.2rem', listStyle: 'disc' }}>
                <li>Access or update your data</li>
                <li>Request deletion of your account</li>
                <li>Request a full data export</li>
              </ul>
              <Text mt={2}>To exercise your rights, email us at: <Link href="mailto:team@thelovegpt.ai" color="pink.600">team@thelovegpt.ai</Link></Text>
            </Box>

            <Box>
              <Heading size="md" mb={2}>7. Third-Party Services</Heading>
              <Text>
                We may use trusted partners like Firebase and Stripe. These platforms are GDPR and security compliant.
              </Text>
            </Box>

            <Box>
              <Heading size="md" mb={2}>8. Children’s Privacy</Heading>
              <Text>LoveGPT is not intended for users under 18. We do not knowingly collect data from minors.</Text>
            </Box>

            <Box>
              <Heading size="md" mb={2}>9. Policy Updates</Heading>
              <Text>
                If we update our privacy policy, you’ll be notified. Continued use after changes indicates your agreement.
              </Text>
            </Box>

            <Box>
              <Heading size="md" mb={2}>10. Contact Us</Heading>
              <Text>Email: <Link href="mailto:team@thelovegpt.ai" color="pink.600">team@thelovegpt.ai</Link></Text>
              <Text>Website: <Link href="https://www.thelovegpt.ai" color="pink.600" isExternal>thelovegpt.ai</Link></Text>
            </Box>

            <Text
              fontSize="md"
              textAlign="center"
              fontStyle="italic"
              color="gray.600"
              mt={10}
              w="full"
            >
              LoveGPT was built on love, not data mining. Your heart is sacred — and so is your privacy.
            </Text>
          </VStack>
        </Container>
      </Box>
    </MainLayout>
  );
}
