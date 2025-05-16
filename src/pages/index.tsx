import { useState, useEffect } from 'react';
import Head from 'next/head';
import MainLayout from '@/layouts/MainLayout';
import ARIAChat from '@/components/ARIAChat';
import PhoneEntryModal from '@/components/onboarding/PhoneEntryModal';
import WaitlistRequestModal from '@/components/onboarding/WaitlistRequestModal';
import InvitationModal from '@/components/onboarding/InvitationModal';
import { Box, Button, Center, Heading, Stack, Text, VStack } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { getUserSession, logout } from '@/utils/auth'; // Assume you have a helper for auth

export default function Home() {
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [showWaitlistModal, setShowWaitlistModal] = useState(false); 
  const [showPhoneEntryModal, setShowPhoneEntryModal] = useState(false); 
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [user, setUser] = useState<any>(null); // Store user session details
  const router = useRouter();

  // Check user session on component mount
  useEffect(() => {
    const userSession = getUserSession();
    if (userSession) {
      setUser(userSession);
      setIsLoggedIn(true);
    }
  }, []);

  const handleLoginLogout = () => {
    if (isLoggedIn) {
      logout(); // Clear user session
      setIsLoggedIn(false);
      setUser(null);
      router.push('/'); // Redirect to homepage
    } else {
      setShowPhoneEntryModal(true); // Show Phone Entry Modal for login
    }
  };

  const handleJoinClick = () => {
    if (isLoggedIn) {
      // Check if user profile is complete and navigate accordingly
      if (user.onboardingComplete) {
        router.push('/dashboard'); // Redirect to dashboard if onboarding is complete
      } else {
        router.push(`/onboarding/step${user.onboardingStep || 1}`); // Redirect to where the user left off in onboarding
      }
    } else {
      setShowPhoneEntryModal(true); // Show Phone Entry Modal for new user
    }
  };

  const handleApplyForInvitation = () => setShowWaitlistModal(true);

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
          {isLoggedIn ? 'Go to Dashboard' : 'Start Your Journey'}
        </Button>

        <Text fontSize="sm" color="gray.500" mt={4}>
          {isLoggedIn ? (
            <Button variant="link" colorScheme="blue" onClick={handleLoginLogout}>
              Log Out
            </Button>
          ) : (
            <Button variant="link" colorScheme="blue" onClick={handleLoginLogout}>
              Log In
            </Button>
          )}
        </Text>
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
            onClick={handleApplyForInvitation}  // Opens Waitlist Request Modal
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

      {/* Show Modals */}
      {showInviteModal && (
        <InvitationModal onClose={() => setShowInviteModal(false)} />
      )}

      {showWaitlistModal && (
        <WaitlistRequestModal onClose={() => setShowWaitlistModal(false)} />
      )}

      {showPhoneEntryModal && (
        <PhoneEntryModal onClose={() => setShowPhoneEntryModal(false)} />
      )}
    </MainLayout>
  );
}
