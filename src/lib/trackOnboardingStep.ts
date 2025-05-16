import { db } from './firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface TrackEventPayload {
  stepName: string;
  phoneNumber: string;
  action: 'step_viewed' | 'step_completed' | string; // extendable
}

export const trackOnboardingStep = async ({ stepName, phoneNumber, action }: TrackEventPayload): Promise<void> => {
  try {
    const docRef = await addDoc(collection(db, 'onboarding_tracking'), {
      stepName,
      phoneNumber,
      action,
      createdAt: serverTimestamp(),
      userAgent: typeof window !== 'undefined' ? navigator.userAgent : 'server', // Fallback for SSR
    });
    
    console.log(`📊 Tracked: ${action} on ${stepName} (Document ID: ${docRef.id})`);
  } catch (error) {
    console.error('🔥 Tracking error:', error);
  }
};
