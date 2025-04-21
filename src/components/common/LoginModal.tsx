// src/components/common/LoginModal.tsx
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { db } from '@/lib/firebase';
import { getDoc, doc } from 'firebase/firestore';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css'; // You can keep this for PhoneInput styling
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Box, Button, Input, Text, Heading, useDisclosure, Flex } from '@chakra-ui/react';
import { checkIfPhoneExists } from '@/lib/checkIfPhoneExists';

interface LoginModalProps {
  onClose: () => void;
  onSuccess?: () => void;
}

export default function LoginModal({ onClose, onSuccess }: LoginModalProps) {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const userPhone = sessionStorage.getItem('lovegpt_user');
    if (userPhone) {
      const onboardingComplete = sessionStorage.getItem('onboardingComplete');
      if (onboardingComplete === 'true') {
        router.push('/dashboard');
      } else {
        const onboardingStep = sessionStorage.getItem('onboardingStep') || 'Step1Name';
        router.push(`/onboarding/${onboardingStep}`);
      }
    }
  }, [router]);

  const requestOtp = async () => {
    setMessage('');
    setLoading(true);

    if (!phone || phone.length < 10) {
      toast.error('📵 Please enter a valid phone number.');
      setLoading(false);
      return;
    }

    try {
      const cleanedPhone = phone.replace(/[^+\d]/g, '');
      setStep('otp');
      toast.success('📲 OTP sent (simulated). Use 123456.');
    } catch (err) {
      console.error('OTP request error:', err);
      toast.error('❌ Failed to send OTP.');
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp || otp !== '123456') {
      toast.error('Invalid OTP. Please try again.');
      return;
    }

    setLoading(true);
    const formattedPhone = phone.startsWith('+') ? phone : `+${phone}`;

    try {
      const exists = await checkIfPhoneExists(formattedPhone);
      if (!exists) {
        toast.error('This number is not registered. Please sign up first.');
        router.push('/signup');
        return;
      }

      const userDoc = await getDoc(doc(db, 'users', formattedPhone));
      const userData = userDoc.data();

      if (!userData) {
        toast.error('User not found.');
        return;
      }

      sessionStorage.setItem('lovegpt_user', formattedPhone);
      localStorage.setItem('phoneNumber', formattedPhone);
      localStorage.setItem('onboardingComplete', userData.onboardingComplete ? 'true' : 'false');
      localStorage.setItem('onboardingStep', userData.onboardingStep || 'Step1Name');

      toast.success('✅ Welcome back to LoveGPT!');
      onSuccess?.();
      onClose?.();

      if (userData.onboardingComplete) {
        router.push('/dashboard');
      } else {
        router.push(`/onboarding/${userData.onboardingStep || 'Step1Name'}`);
      }
    } catch (err) {
      console.error('Login error:', err);
      toast.error('❌ Login failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex
      position="fixed"
      inset={0}
      bg="blackAlpha.600"
      align="center"
      justify="center"
      zIndex="overlay"
    >
      <ToastContainer position="top-center" autoClose={4000} hideProgressBar={false} />

      <Box
        bg="white"
        p={6}
        rounded="xl"
        shadow="lg"
        w="full"
        maxW="sm"
        textAlign="center"
        position="relative"
      >
        <Button
          position="absolute"
          top={2}
          right={2}
          size="sm"
          variant="ghost"
          onClick={onClose}
        >
          ✕
        </Button>

        <Heading size="md" color="pink.500" mb={4}>
          Log In or Sign Up
        </Heading>

        {step === 'phone' ? (
          <>
            <Box mb={4}>
              <PhoneInput
                country={'us'}
                value={phone}
                onChange={(value) => {
                  const formatted = value.startsWith('+') ? value : `+${value}`;
                  setPhone(formatted);
                }}
                enableSearch
                inputProps={{
                  name: 'phone',
                  required: true,
                  autoFocus: true,
                }}
                inputStyle={{
                  width: '100%',
                  textAlign: 'center',
                  padding: '12px',
                  borderRadius: '8px',
                  border: '1px solid #ccc',
                }}
                containerStyle={{ width: '100%' }}
              />
            </Box>
            <Button
              onClick={requestOtp}
              isLoading={loading}
              colorScheme="pink"
              w="full"
              rounded="xl"
            >
              Send OTP
            </Button>
          </>
        ) : (
          <>
            <Input
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              textAlign="center"
              mb={4}
              rounded="lg"
              py={3}
              fontSize="lg"
              letterSpacing="widest"
            />
            <Button
              onClick={verifyOtp}
              isLoading={loading}
              colorScheme="blue"
              w="full"
              rounded="xl"
            >
              Verify OTP
            </Button>
          </>
        )}

        {message && (
          <Text mt={4} fontSize="sm" color="gray.600">
            {message}
          </Text>
        )}

        <Box id="recaptcha-container" mt={2} />
      </Box>
    </Flex>
  );
}
