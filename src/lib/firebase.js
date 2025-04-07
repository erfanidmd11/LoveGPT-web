// src/lib/firebase.js
import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// ✅ Safe reCAPTCHA initialization
export const initializeRecaptcha = (elementId = 'recaptcha-container') => {
  if (typeof window !== 'undefined' && !window.recaptchaVerifier) {
    try {
      const verifier = new RecaptchaVerifier(
        elementId,
        {
          size: 'invisible',
          callback: (response) => {
            console.log('✅ reCAPTCHA solved:', response);
          },
          'expired-callback': () => {
            console.warn('⚠️ reCAPTCHA expired. Try again.');
          }
        },
        auth // ✅ Required to bind Firebase context
      );

      window.recaptchaVerifier = verifier;

      verifier.render().then((widgetId) => {
        window.recaptchaWidgetId = widgetId;
      });
    } catch (err) {
      console.error('🔥 Failed to init reCAPTCHA:', err);
    }
  }
};

// ✅ Send OTP
export const sendPhoneOTP = async (phoneNumber, elementId = 'recaptcha-container') => {
  try {
    initializeRecaptcha(elementId);

    const appVerifier = window.recaptchaVerifier;
    const formatted = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;

    const confirmationResult = await signInWithPhoneNumber(auth, formatted, appVerifier);
    console.log('📲 OTP sent:', formatted);
    return confirmationResult;
  } catch (error) {
    console.error('🚫 sendPhoneOTP error:', error);
    throw error;
  }
};

export { auth, db, storage };
