// src/components/onboarding/Identity/Step2DOB.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ValueCue from '../../ValueCue';
import ProgressBar from '@/components/common/ProgressBar';
import zodiacProfiles from '@/lib/zodiacProfiles';
import { saveAnswer } from '@/lib/saveAnswer';
import { db } from '@/lib/firebase';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const getZodiacSign = (dateString: string): string => {
  const date = new Date(dateString);
  const day = date.getDate();
  const month = date.getMonth() + 1;

  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return 'Aquarius';
  if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return 'Pisces';
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return 'Aries';
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return 'Taurus';
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return 'Gemini';
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return 'Cancer';
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return 'Leo';
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return 'Virgo';
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return 'Libra';
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return 'Scorpio';
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return 'Sagittarius';
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return 'Capricorn';

  return '';
};

const calculateAge = (dob: string): number => {
  const birth = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
    age--;
  }
  return age;
};

export default function Step2DOB({ onNext }) {
  const [dob, setDob] = useState('');
  const [zodiac, setZodiac] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const savedDob = localStorage.getItem('userDOB');
    if (savedDob) {
      setDob(savedDob);
      setZodiac(getZodiacSign(savedDob));
    }
  }, []);

  const handleContinue = async () => {
    if (!dob) return setError('Please enter your birth date.');

    const age = calculateAge(dob);
    if (age < 18) {
      try {
        const email = localStorage.getItem('email') || '';
        const phone = localStorage.getItem('phoneNumber') || '';
        await addDoc(collection(db, 'future_clients'), {
          email,
          phone,
          dob,
          age,
          status: 'underage-block',
          createdAt: serverTimestamp(),
        });
      } catch (err) {
        console.error('🔥 Error logging underage user:', err);
      }

      window.location.href = '/underage';
      return;
    }

    const sign = getZodiacSign(dob);
    setZodiac(sign);
    localStorage.setItem('userDOB', dob);
    localStorage.setItem('onboardingZodiac', sign);
    saveAnswer('userDOB', dob);
    saveAnswer('onboardingZodiac', sign);
    onNext();
  };

  Step2DOB.handleNext = handleContinue;

  const profile = zodiacProfiles[zodiac] || {};

  return (
    <div className="space-y-6 pb-32">
      <ProgressBar step={2} totalSteps={24} />

      <h2 className="text-2xl font-bold text-pink-600">When’s your birthday? 🎂</h2>

      <input
        type="date"
        value={dob}
        onChange={(e) => {
          setDob(e.target.value);
          setError('');
          setZodiac(getZodiacSign(e.target.value));
        }}
        className="w-full border border-pink-200 rounded-xl px-4 py-3 focus:outline-pink-500"
        disabled={!!localStorage.getItem('userDOB')}
      />

      {dob && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <ValueCue cue="Your birthday helps ARIA understand your love rhythm, compatibility, and timing. 🌙" />
        </motion.div>
      )}

      {zodiac && (
        <div className="mt-4 p-4 rounded-xl border border-pink-200 bg-pink-50 text-sm text-gray-700">
          <p>
            You’re a <strong className="text-pink-600">{zodiac}</strong> — a <strong>{profile.element}</strong> sign.
          </p>
          {profile.femaleTraits && (
            <p className="mt-2">
              <span className="font-semibold">Traits:</span> {profile.femaleTraits.join(', ')}
            </p>
          )}
          {profile.bestMatches && (
            <p className="mt-2">
              <span className="font-semibold">Best Matches:</span> {profile.bestMatches.join(', ')}
            </p>
          )}
          <p className="text-xs italic text-gray-500 mt-2">
            Compatibility insights are just one layer of the journey. Let’s keep learning. 💫
          </p>
        </div>
      )}

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
}
