import React, { useEffect, useRef } from 'react';
import { Box, Button, Text, VStack, Heading, Center, Image } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';  // Update for React Router v6
import AnimatedValueCue from '@/components/onboarding/AnimatedValueCue';
import AriaSignature from '@/components/common/AriaSignature';
import Header from '@/components/common/Header';
import Footer from '@/components/common/Footer';
import { db } from '@/firebase/firebaseConfig'; // ✅ Fixed import path
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';

// Save user progress to Firestore
const saveUserProgress = async (uid: string) => {
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      lastVisited: serverTimestamp(),
      currentStep: 'pending18',
    });
  } catch (error) {
    console.error('Error saving user progress: ', error);
  }
};

const Pending18Screen: React.FC = () => {
  const navigate = useNavigate();
  const fadeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (fadeRef.current) {
      fadeRef.current.style.opacity = '0';
      fadeRef.current.style.transition = 'opacity 1s ease-in-out';
      requestAnimationFrame(() => {
        fadeRef.current!.style.opacity = '1';
      });
    }
  }, []);

  const handleExit = () => {
    saveUserProgress('user123');
    navigate('/login', { replace: true });
  };

  return (
    <Box
      ref={fadeRef}
      px="6"
      py="12"
      minHeight="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      bg="#f9fafb"
      textAlign="center"
    >
      <Header />

      <Box mb={8}>
        <Heading as="h2" size="lg" mb={4}>
          🌟 Just a Little More Time...
        </Heading>
        <Text fontSize="md" color="gray.600" mb={6}>
          ARIA here — and trust me, the best journeys are worth the wait. Your moment is coming. 🎉
        </Text>
        <Image
          src="/assets/aria-avatar.png"
          alt="ARIA"
          width="100px"
          height="100px"
          mx="auto"
          mb={6}
        />
      </Box>

      <Center>
        <Button
          colorScheme="pink"
          size="lg"
          onClick={handleExit}
          width="80%"
          maxWidth="300px"
        >
          Got it — See you soon!
        </Button>
      </Center>

      <Box mt={10}>
        <AnimatedValueCue
  message="🌟 Hey future legend. You're just a little early for LoveGPT — but good news: I'm building something epic just for high-achievers like you. 🌱 Stay tuned — greatness is already yours."
/>

      </Box>

      <AriaSignature />

      <Footer />
    </Box>
  );
};

export default Pending18Screen;
