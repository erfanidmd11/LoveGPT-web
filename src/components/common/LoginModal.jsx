// src/components/common/LoginModal.jsx
import React, { useState } from 'react';
import { auth, initializeRecaptcha } from '@/lib/firebase';
import {
  signInWithPhoneNumber,
  PhoneAuthProvider,
  signInWithCredential,
} from 'firebase/auth';

export default function LoginModal({ onClose, onSuccess }) {
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('phone'); // 'phone' or 'otp'
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const requestOtp = async () => {
    setMessage('');
    setLoading(true);
    try {
      if (!window.recaptchaVerifier) {
        initializeRecaptcha('recaptcha-container');
      }
      const appVerifier = window.recaptchaVerifier;
      const confirmation = await signInWithPhoneNumber(auth, `+${phone}`, appVerifier);
      window.confirmationResult = confirmation;
      setStep('otp');
      setMessage('📲 OTP sent. Check your phone.');
    } catch (err) {
      console.error('OTP send error:', err);
      setMessage('Failed to send OTP. Check the number and try again.');
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    setLoading(true);
    try {
      const result = await window.confirmationResult.confirm(otp);
      console.log('✅ Logged in as:', result.user.phoneNumber);
      setMessage('✅ Phone verified!');
      onSuccess?.();
      onClose?.();
    } catch (err) {
      console.error('OTP verification error:', err);
      setMessage('Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-sm text-center relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
          onClick={onClose}
        >
          ✕
        </button>

        <h2 className="text-xl font-semibold mb-4 text-pink-600">Log In or Sign Up</h2>

        {step === 'phone' ? (
          <>
            <input
              type="tel"
              placeholder="Enter phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full mb-4 border rounded-lg px-4 py-2 text-center"
            />
            <button
              onClick={requestOtp}
              disabled={loading}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white py-2 rounded-xl"
            >
              {loading ? 'Sending...' : 'Send OTP'}
            </button>
          </>
        ) : (
          <>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full mb-4 border rounded-lg px-4 py-2 text-center tracking-widest"
            />
            <button
              onClick={verifyOtp}
              disabled={loading}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-xl"
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </>
        )}

        {message && <p className="text-sm mt-4 text-gray-600">{message}</p>}
        <div id="recaptcha-container" className="mt-2" />
      </div>
    </div>
  );
}
