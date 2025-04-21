import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  Auth,
  ConfirmationResult,
} from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
  }
}

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
};

let app: FirebaseApp | undefined;
let auth: Auth | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;

if (typeof window !== 'undefined') {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
} else {
  console.warn('⚠️ Firebase client initialized on server. This should only run in the browser.');
}

/**
 * Sends OTP to a phone number with optional reCAPTCHA
 */
export const sendPhoneOTP = async (
  phoneNumber: string,
  elementId = 'recaptcha-container'
): Promise<ConfirmationResult> => {
  if (!auth) throw new Error('Firebase auth not initialized');

  const formatted = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
  let appVerifier: RecaptchaVerifier | null = null;

  if (process.env.NODE_ENV !== 'development') {
    await initializeRecaptcha(elementId);
    appVerifier = window.recaptchaVerifier!;
  }

  return await signInWithPhoneNumber(auth, formatted, appVerifier!);
};

/**
 * Initializes invisible reCAPTCHA verifier
 */
export const initializeRecaptcha = async (
  elementId = 'recaptcha-container'
): Promise<RecaptchaVerifier | null> => {
  if (
    typeof window !== 'undefined' &&
    process.env.NODE_ENV !== 'development' &&
    auth
  ) {
    const verifier = new RecaptchaVerifier(
      elementId,
      {
        size: 'invisible',
        callback: (response: any) => console.log('✅ reCAPTCHA solved:', response),
        'expired-callback': () => console.warn('⚠️ reCAPTCHA expired. Try again.'),
      },
      auth
    );
    await verifier.render();
    window.recaptchaVerifier = verifier;
    return verifier;
  }
  return null;
};

// 🔓 Skip reCAPTCHA in dev mode
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  try {
    if (auth) {
      auth.settings.appVerificationDisabledForTesting = true;
    }
  } catch (err) {
    console.warn('⚠️ Failed to disable app verification in dev mode:', err);
  }
}


export { app, auth, db, storage };
