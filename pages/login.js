// pages/login.js
import React, { useState } from 'react';
import { auth } from '@/lib/firebase';
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { createUserProfile } from '@/lib/createUserProfile';

export default function Login() {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [message, setMessage] = useState('');

  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => handlePhoneLogin(),
        'expired-callback': () => {
          setMessage('🔁 reCAPTCHA expired. Please try again.');
        },
      });
    }
  };

  const redirectToOnboarding = () => {
    const step = localStorage.getItem('onboardingStep') || '1';
    window.location.href = `/onboarding?step=${step}`;
  };

  const handlePhoneLogin = async () => {
    setupRecaptcha();
    const appVerifier = window.recaptchaVerifier;

    try {
      const result = await signInWithPhoneNumber(auth, phone, appVerifier);
      setConfirmationResult(result);
      setMessage('📲 OTP sent! Check your phone.');
    } catch (err) {
      console.error('SMS error:', err);
      setMessage('⚠️ Failed to send OTP. Double check the number.');
    }
  };

  const verifyOtp = async () => {
    try {
      const result = await confirmationResult.confirm(otp);
      const user = result.user;
      await createUserProfile(user);
      setMessage('✅ Phone login successful!');
      redirectToOnboarding();
    } catch (err) {
      console.error('OTP failed:', err);
      setMessage('❌ Invalid OTP. Please try again.');
    }
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      await createUserProfile(user);
      setMessage('✅ Google login successful!');
      redirectToOnboarding();
    } catch (err) {
      console.error('Google login failed:', err);
      setMessage('❌ Google login failed.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-100 px-4">
      <div className="bg-white shadow-xl rounded-xl p-8 w-full max-w-md text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Welcome back, beautiful soul ✨
        </h2>

        <input
          type="tel"
          placeholder="📱 +1 555-555-5555"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="border px-4 py-2 mb-3 rounded w-full"
        />

        <button
          onClick={handlePhoneLogin}
          className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded w-full mb-4"
        >
          Send OTP
        </button>

        {confirmationResult && (
          <>
            <input
              type="text"
              placeholder="🔒 Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="border px-4 py-2 mb-3 rounded w-full"
            />
            <button
              onClick={verifyOtp}
              className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded w-full mb-4"
            >
              Verify OTP
            </button>
          </>
        )}

        <div className="my-3 text-gray-500 text-sm">— or —</div>

        <button
          onClick={handleGoogleLogin}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded w-full"
        >
          Sign in with Google
        </button>

        <p className="mt-4 text-sm text-gray-700">{message}</p>
        <div id="recaptcha-container" />
      </div>
    </div>
  );
}
