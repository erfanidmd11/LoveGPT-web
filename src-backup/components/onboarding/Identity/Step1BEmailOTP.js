import React, { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { sendEmailVerification } from 'firebase/auth';
import { saveAnswer } from '@/lib/saveAnswer';
import ProgressBar from '@/components/common/ProgressBar';
import NavigationButtons from '@/components/common/NavigationButtons';

const Step1BEmailOTP = ({ onNext, onBack }) => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState('');

  const [countdown, setCountdown] = useState(0);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handleOtpChange = (e) => setOtp(e.target.value);

  const requestOtp = async () => {
    if (!email) return setError('Please enter a valid email address.');
    setSending(true);
    setError('');

    const user = auth.currentUser;

    if (user) {
      try {
        await sendEmailVerification(user);
        alert('Verification email sent. Please check your inbox.');
        setCountdown(60);
      } catch (error) {
        setError('Error sending verification. Please try again.');
        console.error(error);
      } finally {
        setSending(false);
      }
    } else {
      setSending(false);
      setError('No user is signed in.');
    }
  };

  const verifyOtp = async () => {
    if (!otp) return setError('Please enter the OTP.');
    setVerifying(true);
    setError('');

    try {
      if (otp.toLowerCase() === 'verified') {
        saveAnswer('email', email);
        setIsVerified(true);
        onNext();
      } else {
        setError("Please type 'verified' after clicking the email link.");
      }
    } catch (error) {
      setError('Invalid verification. Try again.');
      console.error(error);
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="space-y-6">
      <ProgressBar step={1} totalSteps={24} />

      <h2 className="text-2xl font-bold text-pink-600">Enter Your Email</h2>

      <input
        type="email"
        placeholder="Email Address"
        value={email}
        onChange={handleEmailChange}
        className="w-full border border-pink-200 rounded-xl px-4 py-3 focus:outline-pink-500"
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
        {sending ? 'Sending...' : countdown > 0 ? `Resend in ${countdown}s` : 'Send Verification Email'}
      </button>

      {email && !isVerified && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-pink-600">Verify Your Email</h2>
          <p>Please check your inbox and click the verification link.</p>

          <input
            type="text"
            placeholder="Type 'verified' if you clicked the link"
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
            {verifying ? 'Verifying...' : 'Verify Email'}
          </button>
        </div>
      )}

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

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

export default Step1BEmailOTP;
