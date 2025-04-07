// src/components/onboarding/compatibility/Step17ConflictStyle.js
import React, { useState } from 'react';
import ValueCue from '../../ValueCue';
import ProgressBar from '@/components/common/ProgressBar';
import NavigationButtons from '@/components/common/NavigationButtons';
import { saveAnswer } from '@/lib/saveAnswer';

export default function Step17ConflictStyle({ onNext, onBack }) {
  const [selected, setSelected] = useState(localStorage.getItem('conflictStyle') || '');
  const [loading, setLoading] = useState(false);

  const handleSelect = (value) => {
    setSelected(value);
    saveAnswer('conflictStyle', value);
  };

  const handleContinue = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onNext();
    }, 1000);
  };

  return (
    <div>
      <ProgressBar step={17} totalSteps={24} />

      <h2 className="text-2xl font-bold text-pink-600 mb-6">
        In conflict with others, how do you usually react?
      </h2>

      <div className="grid gap-3">
        {[
          "I go silent or retreat",
          "I raise my voice or get defensive",
          "I over-explain or try to fix it fast",
          "I stay calm but shut down later",
          "I listen first, then respond with care"
        ].map((option) => (
          <button
            key={option}
            onClick={() => handleSelect(option)}
            className={`border px-4 py-2 rounded-xl ${
              selected === option ? 'bg-pink-100 border-pink-400' : ''
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      <ValueCue cue="Understanding your conflict style helps match you with someone whose nervous system complements—not clashes with—yours." />

      <NavigationButtons
        onBack={onBack}
        onNext={handleContinue}
        loading={loading}
        disabledNext={!selected}
      />
    </div>
  );
}