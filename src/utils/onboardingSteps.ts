// src/utils/onboardingSteps.ts

// STEP COMPONENT IMPORTS
import Step2Name from '@/components/onboarding/steps/Step2Name';
import Step3DOB from '@/components/onboarding/steps/Step3DOB';
import Step4Gender from '@/components/onboarding/steps/Step4Gender';
import Step5Orientation from '@/components/onboarding/steps/Step5Orientation';
import Step6Intention from '@/components/onboarding/steps/Step6Intention';
import Step7Readiness from '@/components/onboarding/steps/Step7Readiness';
import Step8Location from '@/components/onboarding/steps/Step8Location';
import Step9Zodiac from '@/components/onboarding/steps/Step9Zodiac';
import Step10Values from '@/components/onboarding/steps/Step10Values';
import Step11Personality from '@/components/onboarding/steps/Step11Personality';
import Step12RelationshipStatus from '@/components/onboarding/steps/Step12RelationshipStatus';
import Step13AIConsent from '@/components/onboarding/steps/Step13AIConsent';
import Step14Parenthood from '@/components/onboarding/steps/Step14Parenthood';
import Step15LoveLanguages from '@/components/onboarding/steps/Step15LoveLanguages';
import Step16ConflictStyle from '@/components/onboarding/steps/Step16ConflictStyle';
import Step17InnerConflict from '@/components/onboarding/steps/Step17InnerConflict';
import Step18AttachmentStyle from '@/components/onboarding/steps/Step18AttachmentStyle';
import Step19CommunicationStyle from '@/components/onboarding/steps/Step19CommunicationStyle';
import Step20Lifestyle from '@/components/onboarding/steps/Step20Lifestyle';
import Step21DealBreakers from '@/components/onboarding/steps/Step21DealBreakers';
import Step22FinancialPhilosophy from '@/components/onboarding/steps/Step22FinancialPhilosophy';
import Step23ConflictResolution from '@/components/onboarding/steps/Step23ConflictResolution';
import Step24PartnershipDynamics from '@/components/onboarding/steps/Step24PartnershipDynamics';
import Step25EmotionalTriggers from '@/components/onboarding/steps/Step25EmotionalTriggers';
import Step26ConditioningBeliefs from '@/components/onboarding/steps/Step26ConditioningBeliefs';
import Step27OpennessLevel from '@/components/onboarding/steps/Step27OpennessLevel';
import Step28Influences from '@/components/onboarding/steps/Step28Influences';
import Step29Spirituality from '@/components/onboarding/steps/Step29Spirituality';
import Step30PoliticalView from '@/components/onboarding/steps/Step30PoliticalView';
import Step31Summary from '@/components/onboarding/steps/Step31Summary';
import Step32FinalReview from '@/components/onboarding/steps/Step32FinalReview';

interface OnboardingStep {
  label: string;
  cue: string;
  name: string;
  component: React.ComponentType<any>;
  selfManaged?: boolean;
}

export const onboardingSteps: OnboardingStep[] = [
  { label: 'Your Full Name', cue: 'How should we address you?', name: 'Step2Name', component: Step2Name },
  { label: 'Date of Birth', cue: 'Helps determine your zodiac and age.', name: 'Step3DOB', component: Step3DOB },
  { label: 'Gender Identity', cue: 'Tell us how you identify.', name: 'Step4Gender', component: Step4Gender },
  { label: 'Orientation', cue: 'Your romantic and sexual orientation.', name: 'Step5Orientation', component: Step5Orientation },
  { label: 'Your Intentions', cue: 'Are you seeking a soulmate or just exploring?', name: 'Step6Intention', component: Step6Intention },
  { label: 'Match Readiness', cue: 'Are you emotionally available?', name: 'Step7Readiness', component: Step7Readiness },
  { label: 'Location', cue: 'Let us match you with people nearby.', name: 'Step8Location', component: Step8Location },
  { label: 'Zodiac Insight', cue: 'Cosmic alignment starts here.', name: 'Step9Zodiac', component: Step9Zodiac },
  { label: 'Core Values', cue: 'What really matters to you?', name: 'Step10Values', component: Step10Values },
  { label: 'Personality Profile', cue: 'Traits that shape your love life.', name: 'Step11Personality', component: Step11Personality },
  { label: 'Relationship Status', cue: 'Let’s understand where you are now.', name: 'Step12RelationshipStatus', component: Step12RelationshipStatus },
  { label: 'AI Consent', cue: 'Do you allow ARIA to help you through AI?', name: 'Step13AIConsent', component: Step13AIConsent },
  { label: 'Parenthood', cue: 'How do you feel about having kids?', name: 'Step14Parenthood', component: Step14Parenthood },
  { label: 'Love Languages', cue: 'How do you give and receive love?', name: 'Step15LoveLanguages', component: Step15LoveLanguages },
  { label: 'Conflict Style', cue: 'How you respond in emotional friction.', name: 'Step16ConflictStyle', component: Step16ConflictStyle },
  { label: 'Inner Conflict', cue: 'How you process your internal struggles.', name: 'Step17InnerConflict', component: Step17InnerConflict },
  { label: 'Attachment Style', cue: 'Your relationship bonding style.', name: 'Step18AttachmentStyle', component: Step18AttachmentStyle },
  { label: 'Communication Style', cue: 'Do you lean toward direct or nuanced?', name: 'Step19CommunicationStyle', component: Step19CommunicationStyle },
  { label: 'Lifestyle Snapshot', cue: 'Your daily patterns and preferences.', name: 'Step20Lifestyle', component: Step20Lifestyle },
  { label: 'Deal Breakers', cue: 'Things you absolutely won’t tolerate.', name: 'Step21DealBreakers', component: Step21DealBreakers },
  { label: 'Financial Views', cue: 'Your relationship with money.', name: 'Step22FinancialPhilosophy', component: Step22FinancialPhilosophy },
  { label: 'Conflict Resolution', cue: 'How do you repair after a rift?', name: 'Step23ConflictResolution', component: Step23ConflictResolution },
  { label: 'Partnership Dynamics', cue: 'Your view of equality and roles.', name: 'Step24PartnershipDynamics', component: Step24PartnershipDynamics },
  { label: 'Emotional Triggers', cue: 'What affects you most emotionally?', name: 'Step25EmotionalTriggers', component: Step25EmotionalTriggers },
  { label: 'Conditioned Beliefs', cue: 'Beliefs you may have inherited.', name: 'Step26ConditioningBeliefs', component: Step26ConditioningBeliefs },
  { label: 'Openness Level', cue: 'How open you are to trying new things.', name: 'Step27OpennessLevel', component: Step27OpennessLevel },
  { label: 'Influences', cue: 'People, events, and ideologies that shaped you.', name: 'Step28Influences', component: Step28Influences },
  { label: 'Spiritual View', cue: 'Your connection to spirituality or religion.', name: 'Step29Spirituality', component: Step29Spirituality },
  { label: 'Political Lens', cue: 'Your worldview and civic engagement.', name: 'Step30PoliticalView', component: Step30PoliticalView },
  { label: 'Profile Summary', cue: 'Quick glance at your full picture.', name: 'Step31Summary', component: Step31Summary },
  { label: 'Final Review', cue: 'Last check before we match you with love.', name: 'Step32FinalReview', component: Step32FinalReview, selfManaged: true },
];
