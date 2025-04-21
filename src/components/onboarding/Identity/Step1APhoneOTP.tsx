import React, { useState, useEffect } from 'react';
import { auth, db, sendPhoneOTP } from '@/lib/firebase';
import { doc, setDoc, addDoc, collection, getDoc, serverTimestamp } from 'firebase/firestore';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { toast, ToastContainer } from 'react-toastify';
import { useRouter } from 'next/router';
import { trackOnboardingStep } from '@/lib/trackOnboardingStep';
import { checkIfPhoneExists } from '@/lib/checkIfPhoneExists';

export default function Step1APhoneOTP({ onNext }: { onNext?: () => void }) {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [testMode] = useState(process.env.NODE_ENV === 'development');

  const handlePhoneNumberChange = (value: string) => setPhoneNumber(value);
  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => setOtp(e.target.value);

  const requestOtp = async () => {
    if (!phoneNumber || phoneNumber.length < 10) {
      toast.error('📵 Please enter a valid phone number.');
      return;
    }

    const cleanedPhone = `+${phoneNumber.replace(/[^\d]/g, '')}`;
    setLoading(true);

    try {
      const existing = await checkIfPhoneExists(cleanedPhone);

      if (existing) {
        sessionStorage.setItem('lovegpt_user', cleanedPhone);

        if (existing.onboardingComplete) {
          sessionStorage.setItem('onboardingComplete', 'true');
          router.push('/dashboard');
        } else {
          const step = existing.onboardingStep || '1';
          sessionStorage.setItem('onboardingStep', step);
          router.push(`/onboarding/step${step}`);
        }

        return;
      }

      if (testMode) {
        console.log('🧪 Test Mode: OTP sending skipped.');
        setTimer(60);
        toast.success('✅ OTP skipped in development mode.');
      } else {
        await sendPhoneOTP(phoneNumber);
        setTimer(60);
        toast.success('📲 OTP sent! Check your phone.');
      }
    } catch (error) {
      console.error('🚫 Error sending OTP:', error);
      toast.error('❌ Failed to send OTP. Please try again.');
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
    const cleanedPhone = `+${phoneNumber.replace(/[^\d]/g, '')}`;

    try {
      if (testMode && otp === '123456') {
        console.log('🧪 Test OTP passed');
        await handleSuccess(cleanedPhone);
      } else {
        const isValid = otp === '123456'; // Replace with Firebase confirmationResult.verify()
        if (isValid) {
          await handleSuccess(cleanedPhone);
        } else {
          toast.error('❌ Invalid OTP. Try again.');
        }
      }
    } catch (err) {
      console.error('Verification error:', err);
      toast.error('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  const handleSuccess = async (cleanedPhone: string) => {
    const inviteCode = localStorage.getItem('inviteCode');

    let referralInfo = {
      invitedBy: null,
      lineage: [],
      level: 0,
    };

    if (inviteCode) {
      const inviteRef = doc(db, 'invitationCodes', inviteCode);
      const inviteSnap = await getDoc(inviteRef);
      if (inviteSnap.exists()) {
        const inviteData = inviteSnap.data();
        referralInfo = {
          invitedBy: inviteData.createdBy || null,
          lineage: [...(inviteData.lineage || []), cleanedPhone],
          level: (inviteData.level || 0) + 1,
        };
      }
    }

    try {
      const userRef = doc(db, 'users', cleanedPhone);
      await setDoc(
        userRef,
        {
          phoneNumber: cleanedPhone,
          onboardingStarted: true,
          onboardingStep: '2',
          referral: referralInfo,
          createdAt: serverTimestamp(),
        },
        { merge: true }
      );

      sessionStorage.setItem('lovegpt_user_id', cleanedPhone);
      sessionStorage.setItem('onboardingStep', '2');
      localStorage.setItem('phoneNumber', cleanedPhone);

      await addDoc(collection(db, 'onboardingAnalytics'), {
        event: 'user_logged_in',
        phoneNumber: cleanedPhone,
        uid: cleanedPhone,
        timestamp: serverTimestamp(),
        platform: typeof navigator !== 'undefined' ? navigator.userAgent : 'unknown',
      });

      toast.success('🎉 Welcome to LoveGPT!');
      await trackOnboardingStep({
        stepName: 'Step1APhoneOTP',
        phoneNumber: cleanedPhone,
        action: 'step_completed',
      });

      if (onNext) {
        onNext();
      } else {
        router.push('/onboarding/Step1BEmailOTP');
      }
    } catch (err) {
      console.error('🔥 Firestore error:', err);
      toast.error('Failed to save user.');
    }
  };

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((t) => t - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-pink-50 to-purple-100">
      <div className="bg-white w-full max-w-lg p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-semibold text-center mb-4 text-pink-600">
          Enter Your Phone Number
        </h2>

        <PhoneInput
          country="us"
          value={phoneNumber}
          onChange={handlePhoneNumberChange}
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
            placeholder: 'Enter your phone number',
          }}
        />

        <button
          onClick={requestOtp}
          disabled={loading || timer > 0}
          className={`w-full mt-4 bg-pink-500 hover:bg-pink-600 text-white py-2 rounded-xl ${
            loading || timer > 0 ? 'cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Sending OTP...' : timer > 0 ? `Resend in ${timer}s` : 'Send OTP'}
        </button>

        {timer > 0 && (
          <div className="mt-4">
            <input
              type="text"
              value={otp}
              onChange={handleOtpChange}
              placeholder="Enter OTP"
              className="w-full px-4 py-2 rounded-lg border border-pink-200 mt-4"
            />
            <button
              onClick={verifyOtp}
              disabled={loading}
              className={`w-full mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-xl ${
                loading ? 'cursor-not-allowed' : ''
              }`}
            >
              {loading ? 'Verifying...' : 'Verify OTP'}
            </button>
          </div>
        )}

        <ToastContainer position="top-center" autoClose={4000} hideProgressBar />
      </div>
    </div>
  );
}
