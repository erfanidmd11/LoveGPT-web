import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, signInWithPhoneNumber } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// ✅ Production-safe Firebase config from environment variables
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// ✅ Safe Recaptcha initialization using setTimeout and dynamic import
export const initializeRecaptcha = async (elementId = 'recaptcha-container') => {
  if (typeof window !== 'undefined' && !window.recaptchaVerifier) {
    setTimeout(async () => {
      try {
        const { RecaptchaVerifier } = await import('firebase/auth');

        window.recaptchaVerifier = new RecaptchaVerifier(
          elementId,
          {
            size: 'invisible',
            callback: (response) => {
              console.log('✅ reCAPTCHA solved:', response);
            },
            'expired-callback': () => {
              console.warn('⚠️ reCAPTCHA expired. Try again.');
            },
          },
          auth
        );

        await window.recaptchaVerifier.render().then((widgetId) => {
          window.recaptchaWidgetId = widgetId;
        });
      } catch (err) {
        console.error('🔥 Failed to init reCAPTCHA:', err.message);
      }
    }, 100); // Slight delay ensures auth is hydrated properly
  }
};

// ✅ Send OTP with formatted phone number
export const sendPhoneOTP = async (phoneNumber, elementId = 'recaptcha-container') => {
  try {
    await initializeRecaptcha(elementId);
    const appVerifier = window.recaptchaVerifier;
    const formatted = phoneNumber.startsWith('+') ? phoneNumber : `+${phoneNumber}`;
    const confirmationResult = await signInWithPhoneNumber(auth, formatted, appVerifier);
    console.log('📲 OTP sent:', formatted);
    return confirmationResult;
  } catch (error) {
    console.error('🚫 sendPhoneOTP error:', error.message);
    throw error;
  }
};

export { auth, db, storage };
