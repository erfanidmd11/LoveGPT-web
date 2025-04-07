// src/components/onboarding/Relationship/Step5Readiness.js
import React, { useState } from 'react';
import ValueCue from '../../ValueCue';
import { saveAnswer } from '@/lib/saveAnswer';
import ProgressBar from '@/components/common/ProgressBar';
import NavigationButtons from '@/components/common/NavigationButtons';

const readinessLevels = [
  {
    label: "Green — I’m emotionally available and ready to meet someone",
    value: "green"
  },
  {
    label: "Yellow — I’m open, but healing or cautious",
    value: "yellow"
  },
  {
    label: "Red — I’m uncertain or exploring myself first",
    value: "red"
  }
];

export default function Step5Readiness({ onNext, onBack }) {
  const [readiness, setReadiness] = useState(localStorage.getItem('readinessLevel') || '');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleContinue = () => {
    if (!readiness) {
      return setError("Please select your current emotional readiness.");
    }

    setLoading(true);
    setTimeout(() => {
      saveAnswer('readinessLevel', readiness);
      setLoading(false);
      onNext();
    }, 500);
  };

  return (
    <div className="space-y-6">
      <ProgressBar step={5} totalSteps={24} />

      <h2 className="text-2xl font-bold text-pink-600">How emotionally ready are you?</h2>

      <select
        value={readiness}
        onChange={(e) => {
          setReadiness(e.target.value);
          setError('');
        }}
        className="w-full border border-pink-200 rounded-xl px-4 py-3 focus:outline-pink-500"
      >
        <option value="">Select your readiness level</option>
        {readinessLevels.map((option) => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>

      <ValueCue cue="We respect where you're at in your journey. This helps ARIA support your pace and emotional bandwidth." />

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

      <NavigationButtons
        onBack={onBack}
        onNext={handleContinue}
        loading={loading}
        disabledNext={!readiness}
        nextLabel="Continue →"
      />
    </div>
  );
}
