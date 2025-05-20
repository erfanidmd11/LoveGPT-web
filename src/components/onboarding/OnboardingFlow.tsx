import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { doc, getDoc, updateDoc, Timestamp, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';

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

const steps = [
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
  const navigation = useNavigation();
  const route = useRoute();
  const phone = route.params?.phone;

  const [currentStep, setCurrentStep] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!phone) {
      Alert.alert('Error', 'Missing phone number');
      navigation.goBack();
    } else {
      initializeUserFlow();
    }
  }, []);

  const initializeUserFlow = async () => {
    setLoading(true);
    try {
      const userRef = doc(db, 'users', phone);
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        // New user: create Firestore doc and start onboarding
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
        // Existing user who completed onboarding: check for daily question
        const lastAsked = userData.lastQuestionTimestamp?.toDate();
        const now = new Date();
        const oneDay = 24 * 60 * 60 * 1000;

        if (!lastAsked || now.getTime() - lastAsked.getTime() > oneDay) {
          navigation.navigate('ValueCuePrompt', { uid: userSnap.id }, { replace: true });
        } else {
          navigation.navigate('Dashboard', { replace: true });
        }
      } else {
        // Incomplete onboarding user
        const startedAt = userData.startedAt?.toDate();
        const now = new Date();

        if (startedAt && now.getTime() - startedAt.getTime() > 14 * 24 * 60 * 60 * 1000) {
          // Reset if it's been 14+ days
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
      Alert.alert('Error', 'Something went wrong. Please try again.');
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
      <View style={styles.loader}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading onboarding...</Text>
      </View>
    );
  }

  const StepComponent = steps[currentStep];

  return (
    <View style={styles.container}>
      <StepComponent
        phone={phone}
        onNext={() => goToStep(currentStep + 1)}
        onBack={currentStep > 0 ? () => goToStep(currentStep - 1) : undefined}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
});
