'use client';

import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Button,
  Input,
  VStack,
  useToast,
  Text,
  Heading,
  Spinner,
} from '@chakra-ui/react';
import { auth } from '@/lib/firebase';
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
} from 'firebase/auth';
import { createUserProfile } from '@/lib/createUserProfile';
import { useRouter } from 'next/navigation';

export default function PhoneAuth() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const recaptchaRef = useRef<HTMLDivElement | null>(null);
  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      !window.recaptchaVerifier &&
      recaptchaRef.current
    ) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        recaptchaRef.current,
        {
          size: 'invisible',
          callback: (response: unknown) => {
            console.log('✅ reCAPTCHA verified:', response);
          },
        },
        auth
      );
    }
  }, []);

  const handleSendOTP = async () => {
    setLoading(true);
    try {
      const appVerifier = window.recaptchaVerifier;
      const result = await signInWithPhoneNumber(auth, phone, appVerifier);
      setConfirmationResult(result);
      setOtpSent(true);
      toast({
        title: 'Code sent!',
        description: 'Check your phone for the verification code.',
        status: 'success',
        duration: 4000,
        isClosable: true,
      });
    } catch (error) {
      console.error('🔥 Failed to send OTP:', error);
      toast({
        title: 'Failed to send OTP',
        description: 'Please check the phone number and try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!confirmationResult) return;
    setLoading(true);
    try {
      const result = await confirmationResult.confirm(otp);
      const user = result.user;

      await createUserProfile(user); // Save user to Firestore
      toast({
        title: 'Welcome!',
        description: 'You’re now logged in 🎉',
        status: 'success',
        duration: 4000,
        isClosable: true,
      });
      router.push('/dashboard');
    } catch (error) {
      console.error('❌ OTP verification failed:', error);
      toast({
        title: 'Invalid Code',
        description: 'Please try again.',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box maxW="md" mx="auto" p={6} borderRadius="xl" shadow="md" bg="white">
      <Heading size="md" mb={4} textAlign="center" color="pink.500">
        Secure Login
      </Heading>

      <VStack spacing={4}>
        {!otpSent ? (
          <>
            <Input
              placeholder="+1 555 123 4567"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              type="tel"
              focusBorderColor="pink.400"
            />
            <Button
              colorScheme="pink"
              width="100%"
              onClick={handleSendOTP}
              isLoading={loading}
            >
              Send Code
            </Button>
          </>
        ) : (
          <>
            <Input
              placeholder="Enter 6-digit code"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              focusBorderColor="green.400"
            />
            <Button
              colorScheme="green"
              width="100%"
              onClick={handleVerifyOTP}
              isLoading={loading}
            >
              Verify & Continue
            </Button>
          </>
        )}
      </VStack>

      <div ref={recaptchaRef} />
    </Box>
  );
}