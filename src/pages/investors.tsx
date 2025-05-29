import React, { useState } from 'react';
import {
  Box,
  Button,
  Center,
  Grid,
  Heading,
  SimpleGrid,
  Stack,
  Text,
  VStack,
  useDisclosure,
} from '@chakra-ui/react';
import { Phone, FileText, BarChart } from 'lucide-react';
import ARIAChat from '@/components/ARIAChat';
import ContactModal from '@/components/ContactModal';
import MainLayout from '@/layouts/MainLayout';
import Link from 'next/link';

const sections = [
  'A Message from Our Founder',
  'Vision & Mission',
  'Problem Statement',
  'The LoveGPT Solution',
  'Core Features',
  'Market Opportunity',
  'Competitive Advantage',
  'Revenue Model & Tokenomics',
  'Use of Funds',
  'Marketing Strategy & Go-To-Market Plan',
  'The Human Value Proposition',
  'Team & Founders',
  'Closing Statement'
];

const sectionContent = [
  `<p>At LoveGPT, we believe the purpose of life is love — not just romantic love, but the profound human connection that gives our existence meaning...</p>`,
  `<p><strong>Vision:</strong> To elevate the human experience of love and relationships by merging deep emotional intelligence with cutting-edge AI...</p>`,
  `<p>The dating landscape is broken. People are matching based on physical appearance, fleeting chemistry, or social pressure...</p>`,
  `<p>LoveGPT is a relationship revolution — a tech-enabled path to conscious coupling. We merge psychology, AI, and human values...</p>`,
  `<p>Features include AI compatibility engine, emotional maturity diagnostics, core value assessments, mentorship, and tokenized progress tracking...</p>`,
  `<p>The relationship, dating, and personal growth markets are a combined $100B+ global opportunity. Millennials and Gen Z demand emotionally aligned, tech-enhanced tools...</p>`,
  `<p>We are the only platform combining full-spectrum readiness scoring with daily coaching via ARIA and AI-powered value-based matchmaking...</p>`,
  `<p>Our freemium-to-premium model is layered with tokenization for growth rewards, private coaching, and marketplace enhancements...</p>`,
  `<p>We're seeking $3M to power our next phase of growth. 35% for community scaling, 20% tech refinement, 15% for conscious talent acquisition...</p>`,
  `<p>Our marketing playbook is bold, viral, and community-centric. With over 20M reach through strategic influencer and therapist partnerships, plus high-velocity waitlist referral mechanics, our go-to-market strategy is primed for exponential impact...</p>`,
  `<p>LoveGPT changes how people connect, love, and grow. It's a platform of purpose, and a legacy movement. People become not just users — but conscious co-creators of the next era of love.</p>`,
  `<p>Our founding team includes pioneers in AI, NLP, psychology, quantum mechanics, and emotional healing. Our advisory board spans neurology, therapy, spiritual leadership, and venture-backed founders...</p>`,
  `<p>This is more than tech. This is legacy. Investors in LoveGPT are not only participating in one of the most scalable and purposeful relationship ecosystems ever created — they’re becoming part of something humanity urgently needs. This is your moment to bet on love — and win.</p>`
];

export default function Investors() {
  const [showContactModal, setShowContactModal] = useState(false);

  return (
    <MainLayout>
      <Box bgGradient="linear(to-b, white, indigo.100)" color="gray.800" pt={28} px={6}>
        <Box maxW="5xl" mx="auto" mb={24}>
          <Box textAlign="center" bgGradient="linear(to-r, indigo.100, pink.100)" borderRadius="xl" shadow="xl" p={12}>
            <Heading fontSize="6xl" fontWeight="extrabold" color="indigo.800" mb={6}>Revolutionizing Love</Heading>
            <Text fontSize="2xl" color="gray.700" maxW="2xl" mx="auto">
              LoveGPT is not just a dating platform — it's a mission to heal relationships and upgrade emotional intelligence worldwide.
            </Text>
            <Text mt={4} fontStyle="italic" fontSize="md" color="gray.600">
              "Join the emotional evolution. Build the future of love with us."
            </Text>
          </Box>

          {sections.map((section, i) => (
            <Box key={i} bg="white" borderRadius="3xl" shadow="lg" p={8} my={12} _hover={{ shadow: '2xl' }}>
              <Heading fontSize="3xl" fontWeight="bold" color="indigo.700" mb={4} textAlign="center">{section}</Heading>
              <Box className="prose" maxW="3xl" mx="auto" dangerouslySetInnerHTML={{ __html: sectionContent[i] }} />
            </Box>
          ))}

          <Box bgGradient="linear(to-br, indigo.50, white)" py={16} textAlign="center">
            <Heading fontSize="2xl" fontWeight="bold" mb={4}>Talk to the Team or ARIA</Heading>
            <Text color="gray.600" mb={8} maxW="xl" mx="auto">
              ARIA is trained to answer investor questions, or connect with our founder directly.
            </Text>
            <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={6} maxW="4xl" mx="auto">
              <Button onClick={() => setShowContactModal(true)} bg="indigo.600" color="white">💬 Connect</Button>
              <Link href="tel:+17607078542" passHref><Button as="a" bg="green.600" color="white">📞 Call</Button></Link>
              <Button onClick={() => window.open('/financials', '_blank')} bg="blue.600" color="white">📊 Financials</Button>
              <Button onClick={() => window.open('/pitch-deck', '_blank')} bg="purple.600" color="white">📎 Pitch Deck</Button>
            </SimpleGrid>
            {showContactModal && <ContactModal onClose={() => setShowContactModal(false)} />}
          </Box>

          <Box py={20} bg="indigo.50" borderTop="1px solid" borderColor="gray.200">
            <Box textAlign="center" maxW="xl" mx="auto">
              <Heading fontSize="2xl" fontWeight="bold" color="indigo.700">Ask ARIA About LoveGPT</Heading>
              <Text color="gray.600" mb={6}>
                ARIA is infused with our pitch, purpose, and product vision. Ask her anything.
              </Text>
            </Box>
            <Box maxW="2xl" mx="auto">
              <ARIAChat />
            </Box>
          </Box>

          <Box as="footer" bg="indigo.800" color="white" py={12} mt={24}>
            <Box maxW="5xl" mx="auto" px={4} textAlign="center">
              <Heading fontSize="xl" fontWeight="semibold">Explore More</Heading>
              <Stack direction="row" justify="center" gap={4} wrap="wrap" mt={4}>
                <Link href="mailto:admin@thelovegpt.ai" passHref>
                  <Button as="a" bg="green.600" color="white">📧 Email Us</Button>
                </Link>
                <Link href="/pitch-deck" passHref>
                  <Button as="a" bg="purple.600" color="white">📎 Pitch Deck</Button>
                </Link>
                <Link href="/financials" passHref>
                  <Button as="a" bg="gray.600" color="white">📊 Financials (Coming Soon)</Button>
                </Link>
              </Stack>
              <Text fontSize="sm" color="gray.200" mt={4}>
                © {new Date().getFullYear()} LoveGPT. All rights reserved.
              </Text>
            </Box>
          </Box>
        </Box>
      </Box>
    </MainLayout>
  );
}
