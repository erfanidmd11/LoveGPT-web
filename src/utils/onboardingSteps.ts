// src/config/onboardingSteps.ts

import Step1APhoneOTP from '@/components/onboarding/Identity/Step1APhoneOTP';
import Step1BEmailOTP from '@/components/onboarding/Identity/Step1BEmailOTP';
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
import Step13innerConflictStyle from '@/components/onboarding/Personality/Step13innerConflictStyle';
import Step14CommunicationStyle from '@/components/onboarding/Lifestyle/Step14CommunicationStyle';
import Step15Lifestyle from '@/components/onboarding/Lifestyle/Step15Lifestyle';
import Step16DealBreakers from '@/components/onboarding/compatibility/Step16DealBreakers';
import Step17conflictStyle from '@/components/onboarding/compatibility/Step17conflictStyle';
import Step18AttachmentStyle from '@/components/onboarding/compatibility/Step18AttachmentStyle';
import Step19FinancialPhilosophy from '@/components/onboarding/compatibility/Step19FinancialPhilosophy';
import Step20conflictResolution from '@/components/onboarding/Lifestyle/Step20conflictResolution';
import Step21PartnershipDynamics from '@/components/onboarding/Relationship/Step21PartnershipDynamics';
import Step22EmotionalTriggers from '@/components/onboarding/emotional/Step22EmotionalTriggers';
import Step23ConditioningBeliefs from '@/components/onboarding/connection/Step23ConditioningBeliefs';
import Step24OpennessLevel from '@/components/onboarding/Personality/Step24OpennessLevel';
import Step25ReviewSubmit from '@/components/onboarding/Step25ReviewSubmit';

interface OnboardingStep {
  label: string;
  cue: string;
  name: string;
  component: React.ComponentType<any>;
  selfManaged?: boolean;
}

export const onboardingSteps: OnboardingStep[] = [
  {
    label: 'Verify Phone Number',
    cue: 'Adds an extra layer of security and reduces fake profiles.',
    name: 'Step1APhoneOTP',
    component: Step1APhoneOTP,
    selfManaged: true,
  },
  {
    label: 'Verify Email Address',
    cue: 'Verifying your email ensures we can send important updates.',
    name: 'Step1BEmailOTP',
    component: Step1BEmailOTP,
    selfManaged: true,
  },
  {
    label: 'Enter First Name & Last Name',
    cue: 'We need your real name to build your profile.',
    name: 'Step1Name',
    component: Step1Name,
  },
  {
    label: 'Enter Date of Birth',
    cue: 'This helps us know your age and assign a zodiac sign.',
    name: 'Step2DOB',
    component: Step2DOB,
  },
  {
    label: 'Select Gender',
    cue: 'This helps us find compatible matches.',
    name: 'Step3Gender',
    component: Step3Gender,
  },
  {
    label: 'Set Your Intentions',
    cue: 'What are you looking for? Let us help you connect with like-minded people.',
    name: 'Step4Intention',
    component: Step4Intention,
  },
  {
    label: 'Match Readiness',
    cue: 'Are you ready for a committed relationship? Let’s check.',
    name: 'Step5Readiness',
    component: Step5Readiness,
  },
  {
    label: 'Enter Location',
    cue: 'This helps us match you with people near you.',
    name: 'Step6Location',
    component: Step6Location,
  },
  {
    label: 'Your Core Values',
    cue: 'What are the things you value most in life?',
    name: 'Step7Values',
    component: Step7Values,
  },
  {
    label: 'Your Personality',
    cue: 'Answer a few questions about your personality traits.',
    name: 'Step8Personality',
    component: Step8Personality,
  },
  {
    label: 'Relationship Status',
    cue: 'Are you single, married, or in a relationship?',
    name: 'Step9RelationshipStatus',
    component: Step9RelationshipStatus,
  },
  {
    label: 'AI Consent',
    cue: 'Consent for using AI tools to help with your journey.',
    name: 'Step10AIConsent',
    component: Step10AIConsent,
  },
  {
    label: 'Parenthood Readiness',
    cue: 'Are you ready for parenthood?',
    name: 'Step11Parenthood',
    component: Step11Parenthood,
    selfManaged: true,
  },
  {
    label: 'Love Languages',
    cue: 'What’s your primary love language?',
    name: 'Step12LoveLanguages',
    component: Step12LoveLanguages,
  },
  {
    label: 'Inner Conflict Style',
    cue: 'How do you deal with inner conflicts?',
    name: 'Step13innerConflictStyle',
    component: Step13innerConflictStyle,
  },
  {
    label: 'Communication Style',
    cue: 'How do you prefer to communicate with others?',
    name: 'Step14CommunicationStyle',
    component: Step14CommunicationStyle,
  },
  {
    label: 'Lifestyle',
    cue: 'What’s your lifestyle like?',
    name: 'Step15Lifestyle',
    component: Step15Lifestyle,
  },
  {
    label: 'Deal Breakers',
    cue: 'What’s a deal breaker for you in a relationship?',
    name: 'Step16DealBreakers',
    component: Step16DealBreakers,
  },
  {
    label: 'Conflict Style',
    cue: 'How do you handle conflicts in relationships?',
    name: 'Step17conflictStyle',
    component: Step17conflictStyle,
  },
  {
    label: 'Attachment Style',
    cue: 'What’s your attachment style?',
    name: 'Step18AttachmentStyle',
    component: Step18AttachmentStyle,
  },
  {
    label: 'Financial Philosophy',
    cue: 'What’s your approach to managing money?',
    name: 'Step19FinancialPhilosophy',
    component: Step19FinancialPhilosophy,
  },
  {
    label: 'Conflict Resolution',
    cue: 'How do you resolve conflicts in a relationship?',
    name: 'Step20conflictResolution',
    component: Step20conflictResolution,
  },
  {
    label: 'Partnership Dynamics',
    cue: 'What are your expectations in a relationship?',
    name: 'Step21PartnershipDynamics',
    component: Step21PartnershipDynamics,
  },
  {
    label: 'Emotional Triggers',
    cue: 'What triggers your emotions?',
    name: 'Step22EmotionalTriggers',
    component: Step22EmotionalTriggers,
  },
  {
    label: 'Conditioned Beliefs',
    cue: 'What beliefs have shaped you?',
    name: 'Step23ConditioningBeliefs',
    component: Step23ConditioningBeliefs,
  },
  {
    label: 'Openness Level',
    cue: 'How open are you to new experiences?',
    name: 'Step24OpennessLevel',
    component: Step24OpennessLevel,
  },
  {
    label: 'Review and Submit',
    cue: 'Review your information before submitting your profile.',
    name: 'Step25ReviewSubmit',
    component: Step25ReviewSubmit,
    selfManaged: true,
  },
];
