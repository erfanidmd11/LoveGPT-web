// pages/onboarding/index.js
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import ProgressBar from '@/components/common/ProgressBar'; // ✅ Absolute import with baseUrl "src"

// Step Components
import Step1Name from '@/components/onboarding/Identity/Step1Name';
import Step2DOB from '@/components/onboarding/Identity/Step2DOB';
import Step3Gender from '@/components/onboarding/Identity/Step3Gender';
import Step4Intention from '@/components/onboarding/Relationship/Step4Intention';
import Step5Readiness from '@/components/onboarding/Relationship/Step5Readiness';
import Step6Location from '@/components/onboarding/Identity/Step6Location';
import Step7Values from '@/components/onboarding/Personality/Step7Values';
import Step8Personality from '@/components/onboarding/Personality/Step8Personality';
import Step9RelationshipStatus from '@/components/onboarding/Relationship/Step9RelationshipStatus';
import Step10AIConsent from '@/components/onboarding/Lifestyle/Step10AIConsent';
import Step11Parenthood from '@/components/onboarding/Lifestyle/Step11Parenthood';
import Step12LoveLanguages from '@/components/onboarding/Personality/Step12LoveLanguages';
import Step13InnerConflictStyle from '@/components/onboarding/Personality/Step13InnerConflictStyle';
import Step14CommunicationStyle from '@/components/onboarding/Lifestyle/Step14CommunicationStyle';
import Step15Lifestyle from '@/components/onboarding/Lifestyle/Step15Lifestyle';
import Step16DealBreakers from '@/components/onboarding/compatibility/Step16DealBreakers';
import Step17ConflictStyle from '@/components/onboarding/compatibility/Step17ConflictStyle';
import Step18AttachmentStyle from '@/components/onboarding/compatibility/Step18AttachmentStyle';
import Step19FinancialPhilosophy from '@/components/onboarding/compatibility/Step19FinancialPhilosophy';
import Step20ConflictResolution from '@/components/onboarding/Lifestyle/Step20ConflictResolution';
import Step21PartnershipDynamics from '@/components/onboarding/Relationship/Step21PartnershipDynamics';
import Step22EmotionalTriggers from '@/components/onboarding/emotional/Step22EmotionalTriggers';
import Step23ConditioningBeliefs from '@/components/onboarding/connection/Step23ConditioningBeliefs';
import Step24OpennessLevel from '@/components/onboarding/Personality/Step24OpennessLevel';
import Step25ReviewSubmit from '@/components/onboarding/Step25ReviewSubmit';

// OTP Steps
import Step1APhoneOTP from '@/components/onboarding/Identity/Step1APhoneOTP';
import Step1BEmailOTP from '@/components/onboarding/Identity/Step1BEmailOTP';

// Full onboarding flow
const steps = [
  Step1APhoneOTP,
  Step1BEmailOTP,
  Step1Name,
  Step2DOB,
  Step3Gender,
  Step4Intention,
  Step5Readiness,
  Step6Location,
  Step7Values,
  Step8Personality,
  Step9RelationshipStatus,
  Step10AIConsent,
  Step11Parenthood,
  Step12LoveLanguages,
  Step13InnerConflictStyle,
  Step14CommunicationStyle,
  Step15Lifestyle,
  Step16DealBreakers,
  Step17ConflictStyle,
  Step18AttachmentStyle,
  Step19FinancialPhilosophy,
  Step20ConflictResolution,
  Step21PartnershipDynamics,
  Step22EmotionalTriggers,
  Step23ConditioningBeliefs,
  Step24OpennessLevel,
  Step25ReviewSubmit,
];

export default function OnboardingFlow() {
  const [stepIndex, setStepIndex] = useState(0);
  const totalSteps = steps.length;

  // Load saved step from localStorage on mount
  useEffect(() => {
    const savedStep = parseInt(localStorage.getItem('onboardingStep'), 10);
    if (!isNaN(savedStep) && savedStep < totalSteps) {
      setStepIndex(savedStep);
    }
  }, []);

  const CurrentStep = steps[stepIndex];

  // Go forward
  const goToNextStep = () => {
    const nextIndex = stepIndex + 1;
    if (nextIndex < totalSteps) {
      setStepIndex(nextIndex);
      localStorage.setItem('onboardingStep', nextIndex.toString());
    } else {
      localStorage.removeItem('onboardingStep');
      window.location.href = '/dashboard';
    }
  };

  // Go backward
  const goToPreviousStep = () => {
    if (stepIndex > 0) {
      const prevIndex = stepIndex - 1;
      setStepIndex(prevIndex);
      localStorage.setItem('onboardingStep', prevIndex.toString());
    }
  };

  return (
    <>
      <Head>
        <title>Onboarding | LoveGPT</title>
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 flex items-center justify-center px-4 py-12 transition-all duration-500">
        <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-xl">
          <CurrentStep onNext={goToNextStep} onBack={goToPreviousStep} />
          <ProgressBar step={stepIndex + 1} totalSteps={totalSteps} />
          <div className="text-center text-sm text-gray-500 mt-4">
            Step {stepIndex + 1} of {totalSteps}
          </div>
        </div>
      </div>
    </>
  );
}
