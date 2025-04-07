import React, { useState, useEffect } from 'react';
import axios from 'axios';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

import { auth, initializeRecaptcha } from '@/lib/firebase';
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  PhoneAuthProvider,
  signInWithCredential
} from 'firebase/auth';
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
    if (!phoneNumber) return setError('Please enter a valid phone number.');
    setError('');
    setSending(true);

    try {
      if (!window.recaptchaVerifier) {
        initializeRecaptcha('recaptcha-container');
      }

      const appVerifier = window.recaptchaVerifier;
      const formattedNumber = `+${phoneNumber}`;

      const confirmationResult = await signInWithPhoneNumber(auth, formattedNumber, appVerifier);
      setVerificationId(confirmationResult.verificationId);
      setCountdown(60);
    } catch (err) {
      setError('Error sending OTP. Please try again.');
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp) return setError('Please enter the OTP.');
    setVerifying(true);
    setError('');

    try {
      const credential = PhoneAuthProvider.credential(verificationId, otp);
      await signInWithCredential(auth, credential);
      saveAnswer('phoneNumber', `+${phoneNumber}`);
      setIsVerified(true);
      onNext();
    } catch (err) {
      setError('Invalid OTP. Please try again.');
      console.error(err);
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
          border: '1px solid #f9c0d4',
          borderRadius: '0.75rem',
        }}
        placeholder="e.g. 555-123-4567"
        enableSearch
        disableSearchIcon
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
            type="text"
            placeholder="OTP"
            value={otp}
            onChange={handleOtpChange}
            className="w-full border border-pink-200 rounded-xl px-4 py-3 focus:outline-pink-500"
          />
          <button
            onClick={verifyOtp}
            disabled={verifying}
            className={`w-full font-semibold px-6 py-3 rounded-xl ${
              verifying ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-pink-500 hover:bg-pink-600 text-white'
            }`}
          >
            {verifying ? 'Verifying...' : 'Verify OTP'}
          </button>
        </div>
      )}

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

      <NavigationButtons
        onBack={onBack}
        onNext={() => {}}
        loading={false}
        disabledNext={true}
        nextLabel="" // Hide next button
      />
    </div>
  );
};

export default Step1APhoneOTP;
