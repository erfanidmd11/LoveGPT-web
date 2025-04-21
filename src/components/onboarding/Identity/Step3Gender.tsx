import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { saveAnswer } from '@/lib/saveAnswer';
import ValueCue from '../../ValueCue';
import ProgressBar from '@/components/common/ProgressBar';

const genderOptions = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
];

export default function Step3Gender({ onNext }) {
  const [gender, setGender] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('onboardingGender');
    if (saved) {
      setGender(saved);
    }
  }, []);

  const handleContinue = () => {
    if (!gender) {
      setError("Please select your gender.");
      return;
    }

    saveAnswer('onboardingGender', gender);
    localStorage.setItem('onboardingGender', gender);
    onNext();
  };

  Step3Gender.handleNext = handleContinue;

  return (
    <div className="space-y-6 pb-32">
      <ProgressBar step={3} totalSteps={24} />

      <h2 className="text-2xl font-bold text-pink-600">I Am...</h2>

      <select
        value={gender}
        onChange={(e) => {
          setGender(e.target.value);
          setError('');
        }}
        className="w-full border border-pink-200 rounded-xl px-4 py-3 focus:outline-pink-500"
      >
        <option value="">Select your gender</option>
        {genderOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {gender && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <ValueCue cue="ARIA uses this to help match you with someone complementary — in heart, energy, and intention. 💖" />
        </motion.div>
      )}

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
}
