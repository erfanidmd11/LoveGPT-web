// src/components/onboarding/Lifestyle/Step20ConflictResolution.js
import React, { useState } from 'react';
import ValueCue from '../../ValueCue';
import ProgressBar from '@/components/common/ProgressBar';
import NavigationButtons from '@/components/common/NavigationButtons';
import { saveAnswer } from '@/lib/saveAnswer';

export default function Step20ConflictResolution({ onNext, onBack }) {
  const [selected, setSelected] = useState(localStorage.getItem('conflictResolution') || '');
  const [loading, setLoading] = useState(false);

  const handleSelect = (value) => {
    setSelected(value);
    saveAnswer('conflictResolution', value);
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
      <ProgressBar step={20} totalSteps={24} />

      <h2 className="text-2xl font-bold text-pink-600 mb-6">
        What’s your preferred way to resolve a disagreement?
      </h2>

      <div className="grid gap-3">
        {[
          "Talk immediately and resolve it fully",
          "Take space, then come back calmly",
          "Write it out in a message first",
          "Let it go unless it's serious",
          "Go to therapy or ask for outside help"
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

      <ValueCue cue="Your repair style matters more than your conflict. We'll help match you with someone whose resolution rhythm suits yours." />

      <NavigationButtons
        onBack={onBack}
        onNext={handleContinue}
        loading={loading}
        disabledNext={!selected}
        nextLabel="Next"
      />
    </div>
  );
}
