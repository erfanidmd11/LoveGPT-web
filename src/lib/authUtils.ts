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
 */
export const setupRecaptcha = () => {
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
 */
export const sendOtp = async (phoneNumber: string) => {
  setupRecaptcha();
  const appVerifier = window.recaptchaVerifier!;
  return await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
};

/**
 * Confirms the OTP code entered by the user.
 */
export const confirmOtp = async (code: string) => {
  return await window.confirmationResult?.confirm(code);
};
