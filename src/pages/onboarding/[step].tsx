// src/pages/onboarding/[step].tsx
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { onboardingSteps } from '@/config/onboardingSteps';
import NavigationButtons from '@/components/common/NavigationButtons';
import { motion, AnimatePresence } from 'framer-motion';
import { trackOnboardingStep } from '@/lib/trackOnboardingStep';
import {
  Box,
  Text,
  Heading,
  Progress,
  VStack,
  Container,
} from '@chakra-ui/react';

export default function OnboardingStepPage() {
  const router = useRouter();
  const { step } = router.query;

  const [currentStep, setCurrentStep] = useState<any | null>(null);
  const [direction, setDirection] = useState(1);

  const phoneNumber =
    typeof window !== 'undefined'
      ? sessionStorage.getItem('lovegpt_user') || ''
      : '';

  useEffect(() => {
    if (step && typeof step === 'string') {
      const stepObj = onboardingSteps.find((s) => s.name === step);
      if (stepObj) {
        setCurrentStep(stepObj);
      } else {
        router.push('/onboarding/Step1APhoneOTP');
      }
    }
  }, [step, router]);

  useEffect(() => {
    if (step && phoneNumber) {
      trackOnboardingStep({
        stepName: step as string,
        phoneNumber,
        action: 'step_viewed',
      });
    }
  }, [step, phoneNumber]);

  if (!currentStep) return <Text>Loading...</Text>;

  const {
    component: StepComponent,
    name,
    cue,
    label,
    selfManaged = false,
  } = currentStep;

  const currentIndex = onboardingSteps.findIndex((s) => s.name === step);
  const isLastStep = currentIndex === onboardingSteps.length - 1;
  const isFirstStep = currentIndex === 0;
  const totalSteps = onboardingSteps.length;

  const goToNextStep = () => {
    setDirection(1);
    if (isLastStep) {
      router.push('/dashboard');
    } else {
      const nextStep = onboardingSteps[currentIndex + 1]?.name;
      router.push(`/onboarding/${nextStep}`);
    }
  };

  const goToPreviousStep = () => {
    setDirection(-1);
    if (!isFirstStep) {
      const prevStep = onboardingSteps[currentIndex - 1]?.name;
      router.push(`/onboarding/${prevStep}`);
    }
  };

  return (
    <Box minH="100vh" bgGradient="linear(to-br, pink.50, purple.100)" py={12} px={4}>
      <Container maxW="3xl" bg="white" p={8} rounded="2xl" boxShadow="xl" position="relative" pb="120px">
        {/* Step Progress Indicator */}
        <VStack spacing={3} mb={6}>
          <Text fontSize="sm" color="gray.500" textAlign="center">
            Step {currentIndex + 1} of {totalSteps}
          </Text>
          <Progress
            size="sm"
            value={((currentIndex + 1) / totalSteps) * 100}
            colorScheme="pink"
            rounded="full"
            bg="gray.200"
          />
        </VStack>

        {/* Step Title & Cue */}
        <Heading size="lg" color="pink.600" textAlign="center" mb={2}>
          {label}
        </Heading>
        <Text color="gray.600" textAlign="center" mb={6}>
          {cue}
        </Text>

        {/* Step Animation */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step as string}
            initial={{ opacity: 0, x: direction === 1 ? 60 : -60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction === 1 ? -60 : 60 }}
            transition={{ duration: 0.3 }}
          >
            <StepComponent onNext={goToNextStep} onBack={goToPreviousStep} />
          </motion.div>
        </AnimatePresence>

        {/* Global Navigation Buttons */}
        {!selfManaged && (
          <Box position="absolute" bottom="0" left="0" w="full" px={8} pb={6}>
            <NavigationButtons
              onBack={goToPreviousStep}
              onNext={goToNextStep}
              nextLabel={isLastStep ? 'Finish' : 'Next Step'}
            />
          </Box>
        )}
      </Container>
    </Box>
  );
}
