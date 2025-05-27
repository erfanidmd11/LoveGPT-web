import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { auth } from './firebase';

declare global {
  interface Window {
    recaptchaVerifier?: RecaptchaVerifier;
    confirmationResult?: any;
  }
}

/**
 * Sets up the invisible reCAPTCHA verifier on page load.
 * Skips setup in development mode.
 */
export const setupRecaptcha = () => {
  const isDev = process.env.NODE_ENV !== 'production';
  if (typeof window === 'undefined' || isDev) {
    console.log('Dev mode: reCAPTCHA setup skipped');
    return;
  }

  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
      size: 'invisible',
      callback: () => console.log('reCAPTCHA solved'),
      'expired-callback': () => console.warn('reCAPTCHA expired')
    });
    window.recaptchaVerifier.render().catch(console.error);
  }
};

/**
 * Sends an OTP to the specified phone number using Firebase Auth.
 * In dev mode, returns a mock confirmationResult.
 */
export const sendOtp = async (phoneNumber: string) => {
  const isDev = process.env.NODE_ENV !== 'production';

  if (isDev) {
    console.log('Dev mode: Skipping OTP, using mock confirmationResult');
    window.confirmationResult = {
      confirm: () => Promise.resolve({ user: { uid: 'test-user-id', phoneNumber } })
    };
    return window.confirmationResult;
  }

  setupRecaptcha();
  const appVerifier = window.recaptchaVerifier!;
  return await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
};

/**
 * Confirms the OTP code entered by the user.
 * In dev mode, this is mocked already.
 */
export const confirmOtp = async (code: string) => {
  return await window.confirmationResult?.confirm(code);
};
