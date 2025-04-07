// src/components/onboarding/Identity/Step3Gender.js
import React, { useState } from 'react';
import { saveAnswer } from '@/lib/saveAnswer';
import ValueCue from '../../ValueCue';
import ProgressBar from '@/components/common/ProgressBar';
import NavigationButtons from '@/components/common/NavigationButtons';

const genderOptions = [
  { label: "Male", value: "male" },
  { label: "Female", value: "female" },
];

export default function Step3Gender({ onNext, onBack }) {
  const [gender, setGender] = useState(localStorage.getItem('onboardingGender') || '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleContinue = () => {
    if (!gender) {
      setError("Please select your gender.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      saveAnswer('onboardingGender', gender);
      setLoading(false);
      onNext();
    }, 500);
  };

  return (
    <div className="space-y-6">
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

      <ValueCue cue="ARIA uses this to help match you with someone complementary — in heart, energy, and intention. 💖" />

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

      <NavigationButtons
        onBack={onBack}
        onNext={handleContinue}
        loading={loading}
        disabledNext={!gender}
        nextLabel="Continue →"
      />
    </div>
  );
}
