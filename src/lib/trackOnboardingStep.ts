import { db } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface TrackEventPayload {
  stepName: string;
  phoneNumber: string;
  action: 'step_viewed' | 'step_completed' | string; // extendable
}

export const trackOnboardingStep = async ({ stepName, phoneNumber, action }: TrackEventPayload): Promise<void> => {
  try {
    await addDoc(collection(db, 'onboarding_tracking'), {
      stepName,
      phoneNumber,
      action,
      createdAt: serverTimestamp(),
      userAgent: typeof window !== 'undefined' ? navigator.userAgent : 'server',
    });
    console.log(`📊 Tracked: ${action} on ${stepName}`);
  } catch (error) {
    console.error('🔥 Tracking error:', error);
  }
};
