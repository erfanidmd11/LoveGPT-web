import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  signInWithPhoneNumber,
  RecaptchaVerifier,
  signOut,
  setPersistence,
  browserLocalPersistence,
  Auth,
  ConfirmationResult,
} from 'firebase/auth';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { getFunctions, Functions } from 'firebase/functions';  // Import Firebase Functions

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
  }
}

// Firebase configuration using environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID!,
};

// Declare Firebase app and services
let app: FirebaseApp | undefined;
let auth: Auth | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;
let functions: Functions | null = null;  // Declare Firebase Functions

// Initialize Firebase app and services
if (typeof window !== 'undefined') {
  app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  auth = getAuth(app);
  db = getFirestore(app);
  storage = getStorage(app);
  functions = getFunctions(app);  // Initialize Firebase Functions

  // Set persistence to local for browser sessions
  setPersistence(auth, browserLocalPersistence).catch(console.error);

  // Disable app verification in development mode
  if (process.env.NODE_ENV === 'development') {
    auth.settings.appVerificationDisabledForTesting = true;
  }
}

/**
 * Sends OTP to a phone number with optional reCAPTCHA
 * 
 * @param phoneNumber The phone number to which OTP will be sent
 * @param elementId The ID of the element to render reCAPTCHA (default is 'recaptcha-container')
 * @returns A ConfirmationResult which is used for verifying the OTP
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
 * 
 * @param elementId The ID of the element to render reCAPTCHA (default is 'recaptcha-container')
 * @returns A RecaptchaVerifier object
 */
export const initializeRecaptcha = async (
  elementId = 'recaptcha-container'
): Promise<RecaptchaVerifier | null> => {
  if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'development' && auth) {
    const verifier = new (RecaptchaVerifier as any)(
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

// Export Firebase services and functions
export { app, auth, db, storage, functions, signOut };
