import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// ✅ Replace these with YOUR actual Firebase project config values
const firebaseConfig = {
  apiKey: "AIzaSyAxxxxxYourFirebaseKeyHerexxxxx", // 🔑 Safe to expose
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:abc123def456ghi789"
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
        auth
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
