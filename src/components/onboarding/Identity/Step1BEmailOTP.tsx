import React, { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { sendEmailVerification } from 'firebase/auth';
import { saveAnswer } from '@/lib/saveAnswer';
import { doc, setDoc } from 'firebase/firestore';
import ProgressBar from '@/components/common/ProgressBar';
import NavigationButtons from '@/components/common/NavigationButtons';
import { checkIfEmailExists } from '@/lib/checkIfEmailExists';

const Step1BEmailOTP = ({ onNext, onBack }) => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [sending, setSending] = useState(false);
  const [verifying, setVerifying] = useState(false);

  const phone = typeof window !== 'undefined' ? localStorage.getItem('phoneNumber') : '';

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleEmailChange = (e) => setEmail(e.target.value);
  const handleOtpChange = (e) => setOtp(e.target.value);

  const requestOtp = async () => {
    if (!email) return setError('Please enter a valid email address.');
    setError('');
    setSending(true);

    try {
      const alreadyExists = await checkIfEmailExists(email);

      if (alreadyExists) {
        setError(
          'This email is already registered. Please register with a different email or go back to login and register with the phone number associated with this email.'
        );
        return;
      }

      if (process.env.NODE_ENV === 'development') {
        console.log('🧪 Dev mode: Skipping real email verification');
        setCountdown(60);
        alert("Simulated email sent. Type 'verified' below to proceed.");
      } else {
        const user = auth.currentUser;
        if (!user) throw new Error('No user is signed in.');
        await sendEmailVerification(user);
        alert('📧 Verification email sent. Please check your inbox.');
        setCountdown(60);
      }
    } catch (err) {
      console.error('❌ Email verification failed:', err);
      setError('Failed to send verification email. Try again.');
    } finally {
      setSending(false);
    }
  };

  const verifyOtp = async () => {
    if (!otp) return setError('Please enter the code.');
    setVerifying(true);
    setError('');

    try {
      if (otp.toLowerCase() === 'verified') {
        saveAnswer('email', email);

        if (phone) {
          const userRef = doc(db, 'users', phone);
          await setDoc(userRef, { email }, { merge: true });
        }

        setIsVerified(true);
        onNext();
      } else {
        setError("Please type 'verified' after clicking the email link.");
      }
    } catch (err) {
      console.error('❌ Email verification failed:', err);
      setError('Invalid code. Try again.');
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
        className={`w-full font-semibold px-6 py-3 rounded-xl flex items-center justify-center gap-2 ${
          sending || countdown > 0
            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
            : 'bg-pink-500 hover:bg-pink-600 text-white'
        }`}
      >
        {sending ? (
          <>
            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Sending...
          </>
        ) : countdown > 0 ? `Resend in ${countdown}s` : 'Send Verification Email'}
      </button>

      {email && !isVerified && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-pink-600">Verify Your Email</h2>
          <p>
            Check your inbox or type <code className="bg-gray-100 px-1">verified</code> below to simulate.
          </p>

          <input
            type="text"
            placeholder="Type 'verified'"
            value={otp}
            onChange={handleOtpChange}
            className="w-full border border-pink-200 rounded-xl px-4 py-3 focus:outline-pink-500"
          />

          <button
            onClick={verifyOtp}
            disabled={verifying}
            className={`w-full font-semibold px-6 py-3 rounded-xl flex items-center justify-center gap-2 ${
              verifying ? 'bg-gray-300 text-gray-500 cursor-not-allowed' : 'bg-pink-500 hover:bg-pink-600 text-white'
            }`}
          >
            {verifying ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Verifying...
              </>
            ) : 'Verify Email'}
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

export default Step1BEmailOTP;

