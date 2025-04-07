import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

import { auth, initializeRecaptcha, sendPhoneOTP } from '@/lib/firebase';
import { PhoneAuthProvider, signInWithCredential } from 'firebase/auth';
import { saveAnswer } from '@/lib/saveAnswer';
import ProgressBar from '@/components/common/ProgressBar';
import NavigationButtons from '@/components/common/NavigationButtons';

const Step1APhoneOTP = ({ onNext, onBack }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [verificationId, setVerificationId] = useState('');
  const [error, setError] = useState('');
  const [isVerified, setIsVerified] = useState(false);

  const [countdown, setCountdown] = useState(0);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [countryCode, setCountryCode] = useState('us');

  useEffect(() => {
    const inputTimer = setTimeout(() => {
      const input = document.querySelector('.react-phone-input input');
      if (input) input.focus();
    }, 500);
    return () => clearTimeout(inputTimer);
  }, []);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  useEffect(() => {
    const fetchCountry = async () => {
      try {
        const res = await axios.get('https://ipapi.co/json/');
        if (res.data?.country_code) {
          setCountryCode(res.data.country_code.toLowerCase());
        }
      } catch {
        console.warn('🌍 Could not fetch IP location, defaulting to US');
        setCountryCode('us');
      }
    };
    fetchCountry();
  }, []);

  const handleOtpChange = (e) => setOtp(e.target.value);

  const requestOtp = async () => {
    if (!phoneNumber) {
      setError('Please enter a valid phone number.');
      return;
    }

    setError('');
    setSending(true);

    try {
      const formattedNumber = `+${phoneNumber}`;

      if (process.env.NODE_ENV === 'development') {
        console.log('🧪 Dev mode: Simulated OTP');
        setVerificationId('test-verification-id');
        setCountdown(60);
        setError('📲 OTP simulated for development. Use 123456.');
      } else {
        if (!window.recaptchaVerifier) {
          initializeRecaptcha('recaptcha-container');
        }

        const confirmationResult = await sendPhoneOTP(formattedNumber);
        setVerificationId(confirmationResult.verificationId);
        setCountdown(60);
        setError('📲 OTP sent! Check your phone.');
      }
    } catch (err) {
      console.error('❌ OTP error:', err);
      setError('Failed to send OTP. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp) return setError('Please enter the OTP.');
    setVerifying(true);
    setError('');
  
    try {
      if (process.env.NODE_ENV === 'development') {
        if (otp === '123456') {
          console.log('🧪 Dev mode: OTP accepted');
          saveAnswer('phoneNumber', `+${phoneNumber}`);
          setIsVerified(true);
          onNext();
        } else {
          setError('Dev mode: OTP must be 123456');
        }
      } else {
        const credential = PhoneAuthProvider.credential(verificationId, otp);
        await signInWithCredential(auth, credential);
        saveAnswer('phoneNumber', `+${phoneNumber}`);
        setIsVerified(true);
        onNext();
      }
    } catch (err) {
      console.error('❌ OTP verification failed:', err);
      setError('Invalid OTP. Please try again.');
    } finally {
      setVerifying(false);
    }
  };
  

  return (
    <div className="space-y-6">
      <ProgressBar step={1} totalSteps={24} />

      <h2 className="text-2xl font-bold text-pink-600">Enter Your Phone Number</h2>

      <PhoneInput
        country={countryCode}
        value={phoneNumber}
        onChange={setPhoneNumber}
        inputStyle={{
          width: '100%',
          padding: '14px',
          fontSize: '1rem',
          border: '1px solid #f9c0d4',
          borderRadius: '0.75rem',
          outline: 'none',
        }}
        buttonStyle={{
          borderTopLeftRadius: '0.75rem',
          borderBottomLeftRadius: '0.75rem',
        }}
        inputProps={{
          name: 'phone',
          required: true,
          autoFocus: true,
          placeholder: 'Enter your number',
        }}
      />

      <button
        onClick={requestOtp}
        disabled={sending || countdown > 0}
        className={`w-full font-semibold px-6 py-3 rounded-xl ${
          sending || countdown > 0
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-pink-500 hover:bg-pink-600 text-white'
        }`}
      >
        {sending ? 'Sending...' : countdown > 0 ? `Resend in ${countdown}s` : 'Send OTP'}
      </button>

      <div id="recaptcha-container" />

      {verificationId && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-pink-600">Enter OTP</h2>
          <input
            type="tel"
            inputMode="numeric"
            pattern="[0-9]*"
            maxLength="6"
            autoFocus
            placeholder="6-digit OTP"
            value={otp}
            onChange={handleOtpChange}
            className="w-full border border-pink-200 rounded-xl px-4 py-3 text-center tracking-widest font-mono text-lg focus:outline-pink-500"
          />
          <button
            onClick={verifyOtp}
            disabled={verifying}
            className={`w-full font-semibold px-6 py-3 rounded-xl ${
              verifying
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-pink-500 hover:bg-pink-600 text-white'
            }`}
          >
            {verifying ? 'Verifying...' : 'Verify OTP'}
          </button>
        </div>
      )}

      {error && (
        <div className="text-sm text-red-600 bg-red-100 border border-red-200 rounded-xl p-3 mt-2">
          {error}
        </div>
      )}

      <NavigationButtons
        onBack={onBack}
        onNext={() => {}}
        loading={false}
        disabledNext={true}
        nextLabel=""
      />
    </div>
  );
};

export default Step1APhoneOTP;
