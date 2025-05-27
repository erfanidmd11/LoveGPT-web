import { Box, Button, Heading, Text, VStack } from '@chakra-ui/react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import MainLayout from '@/layouts/MainLayout';
import { useEffect, useState } from 'react';

const messages = [
  "ARIA here — your future wingwoman, soul whisperer, and AI-powered guide to love, growth, and emotional mastery.",
  "You’ve just taken the first step toward discovering your true self, clarifying what really matters, and preparing to meet someone who aligns with your core values — your North Star.",
  "When we open the doors, you’ll have ARIA by your side — part therapist, part Tony Robbins, part spiritual strategist.",
  "She’ll help you navigate love, friendships, family, and even legacy building with depth and intentionality.",
  "This is about more than just dating. It’s about becoming the highest version of yourself and creating soul-aligned relationships that elevate your entire life."
];

export default function ThankYou() {
  const router = useRouter();
  const [currentMessage, setCurrentMessage] = useState(0);
  const [displayedText, setDisplayedText] = useState('');

  useEffect(() => {
    if (currentMessage < messages.length) {
      let i = 0;
      const interval = setInterval(() => {
        setDisplayedText(prev => prev + messages[currentMessage][i]);
        i++;
        if (i >= messages[currentMessage].length) {
          clearInterval(interval);
          setTimeout(() => {
            setCurrentMessage(prev => prev + 1);
            setDisplayedText('');
          }, 1500);
        }
      }, 30);
      return () => clearInterval(interval);
    }
  }, [currentMessage]);

  return (
    <MainLayout>
      <Head>
        <title>Welcome to the Inner Circle — LoveGPT</title>
      </Head>
      <Box py={20} textAlign="center">
        <VStack spacing={6} maxW="3xl" mx="auto">
          <Heading size="2xl" color="pink.500">
            You’re Officially on the Radar 💌
          </Heading>
          {currentMessage < messages.length ? (
            <Text fontSize="lg" color="gray.700" fontStyle="italic">
              {displayedText}<span className="blinking-cursor">|</span>
            </Text>
          ) : (
            <Button
              onClick={() => router.push('/')}
              mt={8}
              colorScheme="pink"
              px={6}
              py={4}
              rounded="xl"
              fontSize="lg"
              fontWeight="bold"
            >
              Back to Home
            </Button>
          )}
        </VStack>
      </Box>
      <style jsx>{`
        .blinking-cursor {
          animation: blink 1s step-start infinite;
        }
        @keyframes blink {
          50% {
            opacity: 0;
          }
        }
      `}</style>
    </MainLayout>
  );
}
