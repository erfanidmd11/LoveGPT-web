// src/components/common/LoginModal.jsx
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { auth, initializeRecaptcha } from '@/lib/firebase';
import { signInWithPhoneNumber, onAuthStateChanged } from 'firebase/auth';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';

export default function LoginModal({ onClose, onSuccess }) {
  const router = useRouter();
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState('phone');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [timer, setTimer] = useState(0);

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      setPhone('+15555555555');
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        toast.success('✅ Welcome back to LoveGPT!');
        router.push('/dashboard');
      }
    });
    return () => unsubscribe();
  }, [router]);

  useEffect(() => {
    if (timer > 0) {
      const countdown = setTimeout(() => setTimer(timer - 1), 1000);
      return () => clearTimeout(countdown);
    }
  }, [timer]);

  const requestOtp = async () => {
    setMessage('');
    setLoading(true);

    if (!phone || !phone.startsWith('+') || phone.length < 10) {
      toast.error('📵 Please enter a valid phone number.');
      setLoading(false);
      return;
    }

    try {
      if (
        typeof window !== 'undefined' &&
        process.env.NODE_ENV === 'development' &&
        auth?.settings?.appVerificationDisabledForTesting !== undefined
      ) {
        auth.settings.appVerificationDisabledForTesting = true;
      }

      await initializeRecaptcha('recaptcha-container');
      const appVerifier = window.recaptchaVerifier;
      console.log('📞 Final phone:', phone);
      const confirmation = await signInWithPhoneNumber(auth, phone, appVerifier);
      window.confirmationResult = confirmation;
      setStep('otp');
      setTimer(60);
      toast.info('📲 OTP sent. Check your phone.');
    } catch (err) {
      console.error('OTP send error:', err);
      toast.error('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp) {
      toast.error('Please enter the OTP.');
      return;
    }

    setLoading(true);
    try {
      const result = await window.confirmationResult.confirm(otp);
      toast.success('✅ Welcome to LoveGPT!');
      setMessage('✅ Phone verified!');
      localStorage.setItem('lovegpt_user', result.user.phoneNumber);
      onSuccess?.();
      onClose?.();
      router.push('/dashboard');
    } catch (err) {
      console.error('OTP verification error:', err);
      toast.error('Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <ToastContainer position="top-center" autoClose={4000} hideProgressBar={false} />
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
            <PhoneInput
              country={'us'}
              value={phone}
              onChange={(value) => {
                const formatted = value.startsWith('+') ? value : `+${value}`;
                console.log('📞 Formatted input:', formatted);
                setPhone(formatted);
              }}
              enableSearch
              inputProps={{
                name: 'phone',
                required: true,
                autoFocus: true,
              }}
              inputClass="!w-full !text-center !py-2 !rounded-lg !border"
            />
            <button
              onClick={requestOtp}
              disabled={loading || timer > 0}
              className="w-full mt-4 bg-pink-500 hover:bg-pink-600 text-white py-2 rounded-xl"
            >
              {loading ? 'Sending...' : timer > 0 ? `Resend OTP in ${timer}s` : 'Send OTP'}
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
