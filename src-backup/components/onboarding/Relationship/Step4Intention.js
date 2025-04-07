// src/components/onboarding/Relationship/Step4Intention.js
import React, { useState, useEffect } from 'react';
import { saveAnswer } from '@/lib/saveAnswer';
import ValueCue from '../../ValueCue';
import ProgressBar from '@/components/common/ProgressBar';
import NavigationButtons from '@/components/common/NavigationButtons';

const intentionOptions = [
  { label: "Long-Term Relationship", value: "long_term" },
  { label: "Marriage", value: "marriage" },
  { label: "Casual Dating", value: "casual" },
  { label: "Exploring Myself", value: "self_exploration" },
  { label: "Friendship & Emotional Connection", value: "friendship" }
];

export default function Step4Intention({ onNext, onBack }) {
  const [intention, setIntention] = useState(localStorage.getItem('relationshipGoals') || '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const userDOB = localStorage.getItem('userDOB');
    if (userDOB) {
      const age = calculateAge(userDOB);
      if (age < 18) {
        window.location.href = '/';
      }
    }
  }, []);

  const calculateAge = (dob) => {
    const birth = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const handleContinue = () => {
    if (!intention) {
      return setError("Please select an intention to continue.");
    }

    setLoading(true);

    setTimeout(() => {
      saveAnswer('relationshipGoals', intention);
      setLoading(false);
      onNext();
    }, 500);
  };

  return (
    <div className="space-y-6">
      <ProgressBar step={4} totalSteps={24} />

      <h2 className="text-2xl font-bold text-pink-600">What are you looking for?</h2>

      <select
        value={intention}
        onChange={(e) => {
          setIntention(e.target.value);
          setError('');
        }}
        className="w-full border border-pink-200 rounded-xl px-4 py-3 focus:outline-pink-500"
      >
        <option value="">Select your relationship intention</option>
        {intentionOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      <ValueCue cue="ARIA aligns your matches with shared values and long-term goals. This is your relationship compass." />

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

      <NavigationButtons
        onBack={onBack}
        onNext={handleContinue}
        loading={loading}
        disabledNext={!intention}
        nextLabel="Continue →"
      />
    </div>
  );
}
