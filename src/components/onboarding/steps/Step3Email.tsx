import React, { useState, useEffect } from 'react';
import { Box, Button, Input, Text, VStack, Heading, Textarea } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc, getDoc, getDocs, collection, query, where } from 'firebase/firestore';
import { db } from '@/firebase/firebaseConfig';
import ProgressBar from '@/components/common/ProgressBar';
import AnimatedValueCue from '@/components/onboarding/AnimatedValueCue';
import { getUserSession } from '@/utils/auth'; // For checking user session
import Header from '@/components/Header';  // Import Header
import Footer from '@/components/Footer';  // Import Footer

const Step3Email: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [sent, setSent] = useState(false);
  const [uid, setUid] = useState<string | null>(null);  // To store user UID

  // Check if the user is logged in and retrieve the UID
  useEffect(() => {
    const userSession = getUserSession();
    if (userSession) {
      setUid(userSession.phone);  // Assuming phone is used as UID in your case
      // If the user has already completed their profile, navigate directly to the next step
      if (userSession.onboardingComplete) {
        navigate('/dashboard', { replace: true }); // Redirect to dashboard if onboarding is complete
      } else {
        fetchUserDetails(userSession.phone); // Fetch user details from Firestore
      }
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
        if (data?.email) {
          setEmail(data.email);
          setSent(true);
        }
        if (data?.firstName) {
          setFirstName(data.firstName);
        }
      }
    } catch (error) {
      console.error('Error loading saved email:', error);
    }
  };

  const handleSendConfirmation = async () => {
    if (!email.includes('@')) {
      alert('Please enter a valid email address.');
      return;
    }

    try {
      const emailQuery = query(collection(db, 'users'), where('email', '==', email.toLowerCase()));
      const emailSnap = await getDocs(emailQuery);

      if (!emailSnap.empty) {
        const existingUser = emailSnap.docs[0];
        const usedBy = existingUser.id;

        if (usedBy !== uid) {
          alert('This email is already linked to another account. Please use another email or sign in.');
          return;
        }
      }

      console.log('📧 Email confirmation simulated:', email);
      setSent(true);
      alert('Check your email! Confirmation has been simulated. Don’t forget to check your spam folder too.');
    } catch (error) {
      console.error('Email send error:', error);
      alert('Failed to send confirmation. Try again.');
    }
  };

  const handleContinue = async () => {
    if (!email) {
      alert('Please enter your email.');
      return;
    }

    if (!uid) {
      console.error('UID missing — cannot save email.');
      alert('Missing user ID. Cannot save your email.');
      return;
    }

    try {
      await setDoc(
        doc(db, 'users', uid),
        {
          email: email.toLowerCase(),
          emailConfirmed: false,
          onboardingStep: 3,
        },
        { merge: true }
      );

      // After saving, move to next step (Step 4 - DOB)
      navigate('/onboarding/step4-dob', { replace: true }); // Navigate to Step4DOB
    } catch (error) {
      console.error('Error saving email:', error);
      alert('Could not save your email. Try again.');
    }
  };

  const getPersonalizedCue = () => {
    if (firstName) {
      return `Even when you're not here, ${firstName}, I'll find a way to whisper wisdom into your world. 🌸 Let's connect through your email, so growth never stops.`;
    }
    return "Email is how I whisper insight to you, even when you're not here. It’s how we reconnect, reflect, and grow — together. Don’t forget to check your spam — the deepest wisdom hides sometimes.";
  };

  return (
    <Box p={8} maxW="lg" mx="auto" bg="white" boxShadow="lg" borderRadius="lg">
      {/* Header */}
      <Header />

      <ProgressBar current={3} total={32} />
      <Heading as="h2" size="lg" textAlign="center" mb={6}>
        What’s your email?
      </Heading>

      {/* Email Input */}
      <VStack spacing={4} align="stretch">
        <Input 
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          mb={4}
          type="email"
        />
      </VStack>

      {/* Send Confirmation Button */}
      {!sent ? (
        <Button
          colorScheme="pink"
          size="lg"
          width="100%"
          onClick={handleSendConfirmation}
          isDisabled={!email}
        >
          Send Confirmation Email
        </Button>
      ) : (
        <>
          <Text fontSize="sm" textAlign="center" color="gray.500">
            📬 A confirmation email has been simulated. Be sure to check your spam folder.
          </Text>
          <Button
            colorScheme="pink"
            size="lg"
            width="100%"
            onClick={handleContinue}
          >
            Next
          </Button>
        </>
      )}

      {/* Back Button (Navigates back to Homepage on Web) */}
      <Button variant="link" colorScheme="blue" onClick={() => navigate('/')}>
        Back to Homepage
      </Button>

      <AnimatedValueCue message={getPersonalizedCue()} />

      {/* Footer */}
      <Footer />
    </Box>
  );
};

export default Step3Email;
