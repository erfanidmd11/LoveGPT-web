import React, { useState, useEffect } from 'react';
import { Box, Button, Input, Text, Heading, VStack } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '@/firebase/firebaseConfig';
import ProgressBar from '@/components/common/ProgressBar';
import AnimatedValueCue from '@/components/onboarding/AnimatedValueCue';
import { getUserSession } from '@/utils/auth'; // For checking user session
import { chineseZodiacData } from '@/data/chineseZodiacData'; // Assuming Chinese Zodiac Data is available
import Header from '@/components/Header';  // Import Header
import Footer from '@/components/Footer';  // Import Footer

const Step4DOB: React.FC = () => {
  const navigate = useNavigate();
  const [dobInput, setDobInput] = useState('');
  const [zodiacSign, setZodiacSign] = useState('');
  const [chineseZodiacSign, setChineseZodiacSign] = useState('');
  const [firstName, setFirstName] = useState('');
  const [underage, setUnderage] = useState(false);
  const [uid, setUid] = useState<string | null>(null); // To store user UID

  // Check if the user is logged in and retrieve the UID
  useEffect(() => {
    if (uid) {
      getAnswer(uid, 'Step4DOB').then(data => {
        if (data) console.log('Prefilled data:', data);
      });
    }
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
        if (data?.dob) {
          const date = new Date(data.dob);
          const formatted = `${String(date.getMonth() + 1).padStart(2, '0')}/${String(date.getDate()).padStart(2, '0')}/${date.getFullYear()}`;
          setDobInput(formatted);
          setZodiacSign(getZodiacSign(date));
          setChineseZodiacSign(getChineseZodiac(date));
        }
        if (data?.firstName) {
          setFirstName(data.firstName);
        }
      }
    } catch (error) {
      console.error('Error loading saved DOB:', error);
    }
  };

  const formatDobInput = (text: string) => {
    const cleaned = text.replace(/\D/g, '').slice(0, 8);
    const mm = cleaned.slice(0, 2);
    const dd = cleaned.slice(2, 4);
    const yyyy = cleaned.slice(4, 8);
    let result = mm;
    if (dd) result += '/' + dd;
    if (yyyy) result += '/' + yyyy;
    setDobInput(result);
  };

  const getZodiacSign = (date: Date) => {
    const d = date.getDate();
    const m = date.getMonth() + 1;
    const signs = [
      { sign: 'capricorn', start: [12, 22], end: [1, 19] },
      { sign: 'aquarius', start: [1, 20], end: [2, 18] },
      { sign: 'pisces', start: [2, 19], end: [3, 20] },
      { sign: 'aries', start: [3, 21], end: [4, 19] },
      { sign: 'taurus', start: [4, 20], end: [5, 20] },
      { sign: 'gemini', start: [5, 21], end: [6, 20] },
      { sign: 'cancer', start: [6, 21], end: [7, 22] },
      { sign: 'leo', start: [7, 23], end: [8, 22] },
      { sign: 'virgo', start: [8, 23], end: [9, 22] },
      { sign: 'libra', start: [9, 23], end: [10, 22] },
      { sign: 'scorpio', start: [10, 23], end: [11, 21] },
      { sign: 'sagittarius', start: [11, 22], end: [12, 21] },
    ];
    return (
      signs.find(
        ({ start, end }) => (m === start[0] && d >= start[1]) || (m === end[0] && d <= end[1])
      )?.sign || 'unknown'
    );
  };

  const getChineseZodiac = (date: Date) => {
    const year = date.getFullYear();
    return chineseZodiacData[year % 12];
  };

  const handleNext = async () => {
    if (dobInput.length !== 10) {
      alert('Please enter your full DOB (MM/DD/YYYY).');
      return;
    }

    const [mm, dd, yyyy] = dobInput.split('/');
    const dob = new Date(`${yyyy}-${mm}-${dd}`);
    if (isNaN(dob.getTime())) {
      alert('Invalid Date');
      return;
    }

    const today = new Date();
    const age = today.getFullYear() - dob.getFullYear();
    const birthdayPassed =
      today.getMonth() > dob.getMonth() ||
      (today.getMonth() === dob.getMonth() && today.getDate() >= dob.getDate());

    const realAge = birthdayPassed ? age : age - 1;

    if (realAge < 18) {
      setUnderage(true);
      try {
        await setDoc(
          doc(db, 'users', uid),
          {
            dob: dob.toISOString(),
            pending18: true,
            onboardingStep: 'blocked',
          },
          { merge: true }
        );
        navigate('/pending18', { replace: true }); // Redirect to underage page
      } catch (error) {
        console.error('Error saving underage user:', error);
      }
      return;
    }

    const zodiac = getZodiacSign(dob);
    const chineseZodiac = getChineseZodiac(dob);

    try {
      await setDoc(
        doc(db, 'users', uid),
        {
          dob: dob.toISOString(),
          zodiac,
          chineseZodiac,
          onboardingStep: 5, // Proceed to next step
        },
        { merge: true }
      );

      navigate('/onboarding/step5-location', { replace: true });
    } catch (error) {
      console.error('Error saving DOB:', error);
      alert('Could not save your birthday. Try again.');
    }
  };

  const getPersonalizedCue = () => {
    if (underage) {
      return "🌟 Sometimes the greatest journeys take a little more time. You're already on your way — and when the stars say it's time, I'll be right here, waiting to welcome you. Happy early birthday, legend. 🎉";
    }

    if (firstName && zodiacSign && chineseZodiacSign) {
      return `The stars whispered your story long ago, ${firstName}. ✨ You are a proud ${zodiacSign.toUpperCase()} and a fierce soul of the ${chineseZodiacSign}. Let's walk boldly toward your destiny. 🌟`;
    }

    return 'Your birthday holds stories the stars have whispered for centuries. Whether you believe in signs or not, your birth chart is a piece of your puzzle. Let’s look at it — together.';
  };

  return (
    <Box p={8} maxW="lg" mx="auto" bg="white" boxShadow="lg" borderRadius="lg">
      {/* Header */}
      <Header />

      <ProgressBar step=4 totalSteps=32 />
      <Heading as="h2" size="lg" textAlign="center" mb={6}>
        When were you born?
      </Heading>

      <Input
        placeholder="MM/DD/YYYY"
        value={dobInput}
        onChange={(e) => formatDobInput(e.target.value)}
        maxLength={10}
        mb={4}
        textAlign="center"
        size="lg"
        fontSize="lg"
      />

      <Button
        colorScheme="pink"
        size="lg"
        width="100%"
        onClick={handleNext}
        isDisabled={dobInput.length !== 10}
      >
        Next
      </Button>

      <AnimatedValueCue message={getPersonalizedCue()} />

      {/* Back Button (Navigates back to Homepage on Web) */}
      <Button variant="link" colorScheme="blue" onClick={() => navigate('/')}>
        Back to Homepage
      </Button>

      {/* Footer */}
      <Footer />
    </Box>
  );
};

export default Step4DOB;
