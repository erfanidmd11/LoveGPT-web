import React, { useEffect, useRef } from 'react';
import { Box, Button, Text, VStack, Heading, Center, Image } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';  // Update for React Router v6
import { SafeAreaView } from 'react-native-safe-area-context';
import AnimatedValueCue from '@/components/onboarding/AnimatedValueCue';
import AriaSignature from '@/components/common/AriaSignature';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { db } from '../firebase/firebaseConfig';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';

// Adding some simulated user data to use later
const saveUserProgress = async (uid: string) => {
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      lastVisited: serverTimestamp(),  // Save the last visited time
      currentStep: 'pending18',  // Save the current step to help with progression tracking
    });
  } catch (error) {
    console.error('Error saving user progress: ', error);
  }
};

const Pending18Screen: React.FC = () => {
  const navigate = useNavigate();  // Use React Router v6 `useNavigate` for navigation
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const handleExit = () => {
    saveUserProgress('user123');  // Save user progress on exit (you may replace 'user123' with actual user data)
    navigate('/login', { replace: true });  // After exit, navigate to the login page or home
  };

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: true,
    }).start();
  }, [fadeAnim]);

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View style={{ opacity: fadeAnim }}>
        <Header />  {/* Add Header Component */}
        
        <Box textAlign="center" mb={8}>
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

        <AnimatedValueCue
          message="🌟 Hey future legend. You're just a little early for LoveGPT — but good news: I'm building something epic just for high-achievers like you. 🌱 Stay tuned — greatness is already yours."
          isIntro
        />
        
        <AriaSignature />
        
        <Footer />  {/* Add Footer Component */}
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: '24px',
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#f9fafb',
    alignItems: 'center',
  },
});

export default Pending18Screen;
