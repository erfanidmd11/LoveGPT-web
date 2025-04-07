// src/components/onboarding/Personality/Step7Values.js
import React, { useState } from 'react';
import ValueCue from '../../ValueCue';
import ProgressBar from '@/components/common/ProgressBar';
import NavigationButtons from '@/components/common/NavigationButtons';
import { saveAnswer } from '@/lib/saveAnswer';

const valuesList = ['Family', 'Faith', 'Career', 'Adventure', 'Stability', 'Creativity'];

export default function Step7Values({ onNext, onBack }) {
  const [selectedValues, setSelectedValues] = useState(
    JSON.parse(localStorage.getItem('onboardingCoreValues')) || []
  );
  const [loading, setLoading] = useState(false);

  const toggleValue = (value) => {
    setSelectedValues(prev =>
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    );
  };

  const handleContinue = () => {
    setLoading(true);
    setTimeout(() => {
      saveAnswer('onboardingCoreValues', selectedValues);
      setLoading(false);
      onNext();
    }, 500);
  };

  return (
    <div className="space-y-6">
      <ProgressBar step={7} totalSteps={24} />

      <label className="block text-xl font-bold text-pink-600">
        Which values guide your life?
      </label>

      <div className="flex flex-wrap gap-2">
        {valuesList.map((value) => (
          <button
            type="button"
            key={value}
            onClick={() => toggleValue(value)}
            className={`px-4 py-2 rounded-full border transition ${
              selectedValues.includes(value)
                ? 'bg-pink-500 text-white border-pink-500'
                : 'bg-white text-gray-700 hover:border-pink-400'
            }`}
          >
            {value}
          </button>
        ))}
      </div>

      <ValueCue cue="These values help ARIA align you with someone who shares your deeper life direction." />

      <NavigationButtons
        onBack={onBack}
        onNext={handleContinue}
        loading={loading}
        disabledNext={selectedValues.length === 0}
        nextLabel="Continue →"
      />
    </div>
  );
}
