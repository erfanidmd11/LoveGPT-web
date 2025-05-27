import React, { useState, useEffect } from 'react';
import { Box, Button, Input, Text, Heading, VStack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/firebase/firebaseConfig';
import ProgressBar from '@/components/common/ProgressBar';
import AnimatedValueCue from '@/components/onboarding/AnimatedValueCue';
import { getUserSession } from '@/utils/auth'; // For checking user session
import Header from '@/components/Header';  // Import Header
import Footer from '@/components/Footer';  // Import Footer

const Step5Location: React.FC = () => {
  const navigate = useNavigate();
  const [location, setLocation] = useState('');
  const [firstName, setFirstName] = useState('');
  const [uid, setUid] = useState<string | null>(null); // To store user UID

  // Check if the user is logged in and retrieve the UID
  useEffect(() => {
    if (uid) {
      getAnswer(uid, 'Step5Location').then(data => {
        if (data) console.log('Prefilled data:', data);
      });
    }
    const userSession = getUserSession();
    if (userSession) {
      setUid(userSession.phone);  // Assuming phone is used as UID in your case
      fetchUserDetails(userSession.phone); // Fetch user details from Firestore
    } else {
      navigate('/', { replace: true }); // Redirect to homepage if the user is not logged in
    }
  }, []);

  // Fetch user details from Firestore
  const fetchUserDetails = async (phone: string) => {
    try {
      const userRef = doc(db, 'users', phone);
      const snap = await getDoc(userRef);
      if (snap.exists()) {
        const data = snap.data();
        if (data?.location) setLocation(data.location);
        if (data?.firstName) setFirstName(data.firstName);
      }
    } catch (error) {
      console.error('Error loading saved location:', error);
    }
  };

  const handleContinue = async () => {
    if (uid) {
      saveAnswer('Step5', values);
      await saveAnswerToFirestore(uid, 'Step5', values);
    }
    if (!location.trim()) {
      alert('Please enter your location.');
      return;
    }

    if (!uid) {
      console.error('UID missing — cannot save location.');
      alert('Missing user ID. Cannot save your location.');
      return;
    }

    try {
      await setDoc(
        doc(db, 'users', uid),
        {
          location,
          onboardingStep: 5,
        },
        { merge: true }
      );

      // After saving, move to the next step (Step 6 - Gender)
      navigate('/onboarding/step6-gender', { replace: true });
    } catch (error) {
      console.error('Error saving location:', error);
      alert('Could not save your location. Try again.');
    }
  };

  const getPersonalizedCue = () => {
    if (firstName) {
      return `Your world shapes your dreams, ${firstName}. 🌍 Let's start by grounding our journey — where is home for you right now?`;
    }
    return 'Where you are helps me understand what surrounds you. Love has context — and so do you. 🌍';
  };

  return (
    <Box p={8} maxW="lg" mx="auto" bg="white" boxShadow="lg" borderRadius="lg">
      {/* Header */}
      <Header />

      <ProgressBar current={5} total={32} />
      <Heading as="h2" size="lg" textAlign="center" mb={6}>
        Where are you based?
      </Heading>

      {/* Location Input Field */}
      <VStack spacing={4} align="stretch">
        <Input 
          placeholder="City, State, Country"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
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
        isDisabled={!location}
      >
        Next
      </Button>

      {/* Back Button */}
      <Button
        variant="link"
        colorScheme="blue"
        size="sm"
        onClick={() => navigate('/onboarding/step4-dob')} // Go to the previous step
        mt={4}
      >
        Back to Previous Step
      </Button>

      <AnimatedValueCue message={getPersonalizedCue()} />

      {/* Footer */}
      <Footer />
    </Box>
  );
};

export default Step5Location;
