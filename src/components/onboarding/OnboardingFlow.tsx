import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { doc, getDoc, updateDoc, Timestamp, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';

// Import each onboarding step screen
import Step2Name from './steps/Step2Name';
import Step3Email from './steps/Step3Email';
import Step4DOB from './steps/Step4DOB';
import Step5Location from './steps/Step5Location';
import Step6Gender from './steps/Step6Gender';
import Step7RelationshipStatus from './steps/Step7RelationshipStatus';
import Step8Intentions from './steps/Step8Intentions';
import Step9Readiness from './steps/Step9Readiness';
import Step10CoreValues from './steps/Step10CoreValues';
import Step11Personality from './steps/Step11Personality';
import Step12ProfileReflection from './steps/Step12ProfileReflection';
import Step13Enneagram from './steps/Step13Enneagram';
import Step14DISC from './steps/Step14DISC';
import Step15CoreValueIndex from './steps/Step15CoreValueIndex';
import Step16BigFive from './steps/Step16BigFive';
import Step17AIConsent from './steps/Step17AIConsent';
import Step18Parenthood from './steps/Step18Parenthood';
import Step19LoveLanguages from './steps/Step19LoveLanguages';
import Step20InnerConflictStyle from './steps/Step20InnerConflictStyle';
import Step21CommunicationStyle from './steps/Step21CommunicationStyle';
import Step22Lifestyle from './steps/Step22Lifestyle';
import Step23DealBreakers from './steps/Step23DealBreakers';
import Step24ConflictStyle from './steps/Step24ConflictStyle';
import Step25AttachmentStyle from './steps/Step25AttachmentStyle';
import Step26FinancialPhilosophy from './steps/Step26FinancialPhilosophy';
import Step27ConflictResolution from './steps/Step27ConflictResolution';
import Step28PartnershipDynamic from './steps/Step28PartnershipDynamic';
import Step29EmotionalTriggers from './steps/Step29EmotionalTriggers';
import Step30ConditioningBeliefs from './steps/Step30ConditioningBeliefs';
import Step31OpennessLevel from './steps/Step31OpennessLevel';
import Step32ProfileSetup from './steps/Step32ProfileSetup';

interface OnboardingStepProps {
  phone: string;
  onNext: () => void;
  onBack?: () => void;
}

const steps: React.ComponentType<OnboardingStepProps>[] = [
  Step2Name,
  Step3Email,
  Step4DOB,
  Step5Location,
  Step6Gender,
  Step7RelationshipStatus,
  Step8Intentions,
  Step9Readiness,
  Step10CoreValues,
  Step11Personality,
  Step12ProfileReflection,
  Step13Enneagram,
  Step14DISC,
  Step15CoreValueIndex,
  Step16BigFive,
  Step17AIConsent,
  Step18Parenthood,
  Step19LoveLanguages,
  Step20InnerConflictStyle,
  Step21CommunicationStyle,
  Step22Lifestyle,
  Step23DealBreakers,
  Step24ConflictStyle,
  Step25AttachmentStyle,
  Step26FinancialPhilosophy,
  Step27ConflictResolution,
  Step28PartnershipDynamic,
  Step29EmotionalTriggers,
  Step30ConditioningBeliefs,
  Step31OpennessLevel,
  Step32ProfileSetup,
];

export default function OnboardingFlow() {
  const router = useRouter();
  const phone = router.query.phone as string;

  const [currentStep, setCurrentStep] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!phone) return;
    initializeUserFlow();
  }, [phone]);

  const initializeUserFlow = async () => {
    setLoading(true);
    try {
      const userRef = doc(db, 'users', phone);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await updateDoc(userRef, {
          phoneNumber: phone,
          createdAt: serverTimestamp(),
          onboardingStep: 0,
          onboardingComplete: false,
          startedAt: Timestamp.now(),
        });
        setCurrentStep(0);
        return;
      }

      const userData = userSnap.data();

      if (userData.onboardingStep === 'completed') {
        const lastAsked = userData.lastQuestionTimestamp?.toDate();
        const now = new Date();
        const oneDay = 24 * 60 * 60 * 1000;

        if (!lastAsked || now.getTime() - lastAsked.getTime() > oneDay) {
          router.replace(`/value-cue-prompt?uid=${userSnap.id}`);
        } else {
          router.replace('/dashboard');
        }
      } else {
        const startedAt = userData.startedAt?.toDate();
        const now = new Date();

        if (startedAt && now.getTime() - startedAt.getTime() > 14 * 24 * 60 * 60 * 1000) {
          await updateDoc(userRef, {
            onboardingStep: 0,
            onboardingComplete: false,
            startedAt: Timestamp.now(),
          });
          setCurrentStep(0);
        } else {
          setCurrentStep(userData.onboardingStep || 0);
        }
      }
    } catch (error) {
      console.error('Failed to initialize onboarding flow:', error);
      alert('Something went wrong. Please try again.');
    }
    setLoading(false);
  };

  const goToStep = async (stepIndex: number) => {
    const userRef = doc(db, 'users', phone);
    await updateDoc(userRef, {
      onboardingStep: stepIndex,
      lastUpdated: Timestamp.now(),
    });
    setCurrentStep(stepIndex);
  };

  if (loading || currentStep === null) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-gray-600">
        <p className="text-lg">Loading onboarding...</p>
      </div>
    );
  }

  const StepComponent = steps[currentStep];

  return (
    <div className="min-h-screen bg-white">
      <StepComponent
        phone={phone}
        onNext={() => goToStep(currentStep + 1)}
        onBack={currentStep > 0 ? () => goToStep(currentStep - 1) : undefined}
      />
    </div>
  );
}
