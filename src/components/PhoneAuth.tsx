'use client';

import { useState, useEffect, useRef } from 'react';
import { auth } from '@/lib/firebase';
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  ConfirmationResult,
} from 'firebase/auth';
import { createUserProfile } from '@/lib/createUserProfile';
import { useRouter } from 'next/navigation';

export default function PhoneAuth() {
  const [phone, setPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const recaptchaContainerRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (
      typeof window !== 'undefined' &&
      !window.recaptchaVerifier &&
      recaptchaContainerRef.current
    ) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        recaptchaContainerRef.current,
        {
          size: 'invisible',
          callback: (response: unknown) => {
            console.log('✅ reCAPTCHA verified:', response);
          },
        },
        auth
      );
    }
  }, []);

  const handleSendOTP = async () => {
    try {
      const appVerifier = window.recaptchaVerifier;
      const result = await signInWithPhoneNumber(auth, phone, appVerifier);
      setConfirmationResult(result);
      setOtpSent(true);
    } catch (error) {
      console.error('🔥 Failed to send OTP:', error);
      alert('Failed to send OTP. Please check the number and try again.');
    }
  };

  const handleVerifyOTP = async () => {
    if (!confirmationResult) return;

    try {
      const result = await confirmationResult.confirm(otp);
      const user = result.user;

      // ✅ Save the user profile to Firestore
      await createUserProfile(user);
      router.push('/dashboard');
    } catch (error) {
      console.error('🔥 OTP verification failed:', error);
      alert('Invalid OTP. Please try again.');
    }
  };

  return (
    <div className="max-w-md mx-auto space-y-4">
      {!otpSent ? (
        <>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+1 555 123 4567"
            className="w-full p-3 border rounded"
          />
          <button
            onClick={handleSendOTP}
            className="w-full bg-pink-600 text-white py-2 rounded"
          >
            Send Code
          </button>
        </>
      ) : (
        <>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter 6-digit code"
            className="w-full p-3 border rounded"
          />
          <button
            onClick={handleVerifyOTP}
            className="w-full bg-green-600 text-white py-2 rounded"
          >
            Verify & Continue
          </button>
        </>
      )}
      <div ref={recaptchaContainerRef}></div>
    </div>
  );
}
