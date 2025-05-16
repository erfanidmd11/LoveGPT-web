import React, { useState, useEffect } from 'react';
import { Box, Button, Input, Text, VStack, Heading } from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '@/firebase/firebaseConfig';
import ProgressBar from '@/components/common/ProgressBar';
import AnimatedValueCue from '@/components/onboarding/AnimatedValueCue';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Step2Name: React.FC = () => {
  const history = useHistory();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [uid, setUid] = useState<string | null>(null);

  useEffect(() => {
    const userSession = getUserSession();
    if (userSession) {
      setUid(userSession.phone);
      fetchUserDetails(userSession.phone);
    } else {
      history.push('/');
    }
  }, []);

  const fetchUserDetails = async (phone: string) => {
    try {
      const userRef = doc(db, 'users', phone);
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        const data = snap.data();
        if (data?.firstName) setFirstName(data.firstName);
        if (data?.lastName) setLastName(data.lastName);
      }
    } catch (error) {
      console.error('Error loading saved name:', error);
    }
  };

  const handleContinue = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      alert('Please enter both your first and last name.');
      return;
    }

    if (!uid) {
      console.error('UID missing — cannot save name.');
      alert('Missing user ID. Cannot save your name.');
      return;
    }

    try {
      await setDoc(
        doc(db, 'users', uid),
        {
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          onboardingStep: 2,
        },
        { merge: true }
      );

      history.replace('/onboarding/step3-email');
    } catch (error) {
      console.error('Error saving name:', error);
      alert('Could not save your name. Try again.');
    }
  };

  const getPersonalizedCue = () => {
    if (firstName) {
      return `Before we go any further, ${firstName}... 🌟 Let’s start by honoring your story. What's your full name?`;
    }
    return 'Before we go any further… hi. I’m ARIA — your emotionally intelligent wingwoman, best friend, and occasionally savage truth-teller. My job? To get to know the real you — and help the world fall in love with that version. Let’s start with your name.';
  };

  return (
    <Box p={8} maxW="lg" mx="auto" bg="white" boxShadow="lg" borderRadius="lg">
      {/* Header */}
      <Header />

      <ProgressBar current={2} total={32} />
      <Heading as="h2" size="lg" textAlign="center" mb={6}>
        Let's Get Your Name
      </Heading>

      {/* Name Input Fields */}
      <VStack spacing={4} align="stretch">
        <Input 
          placeholder="First Name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          mb={4}
          size="lg"
        />
        <Input
          placeholder="Last Name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          mb={4}
          size="lg"
        />
      </VStack>

      {/* Next Button */}
      <Button
        colorScheme="pink"
        size="lg"
        width="100%"
        onClick={handleContinue}
        isDisabled={!firstName || !lastName}
      >
        Next
      </Button>

      <AnimatedValueCue message={getPersonalizedCue()} />

      {/* Footer */}
      <Footer />
    </Box>
  );
};

export default Step2Name;
