import React, { useEffect, useRef } from 'react';
import { Box, Button, Text, VStack, Heading, Center, Image } from '@chakra-ui/react';
import { useHistory } from 'react-router-dom';
import { SafeAreaView } from 'react-native-safe-area-context';
import AnimatedValueCue from '@/components/onboarding/AnimatedValueCue';
import AriaSignature from '@/components/common/AriaSignature';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const Pending18Screen: React.FC = () => {
  const history = useHistory();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  const handleExit = () => {
    history.reset({
      index: 0,
      routes: [{ name: 'Login' }],
    });
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
      </Animated.View>
    </SafeAreaView>
  );
};

const styles = {
  container: {
    padding: '24px',
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#f9fafb',
    alignItems: 'center',
  },
};

export default Pending18Screen;
