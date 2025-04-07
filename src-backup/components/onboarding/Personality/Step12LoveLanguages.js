// src/components/onboarding/Personality/Step12LoveLanguages.js
import React, { useState } from 'react';
import ValueCue from '../../ValueCue';
import ProgressBar from '@/components/common/ProgressBar';
import NavigationButtons from '@/components/common/NavigationButtons';
import { saveAnswer } from '@/lib/saveAnswer';

const loveLanguages = [
  'Words of Affirmation',
  'Acts of Service',
  'Receiving Gifts',
  'Quality Time',
  'Physical Touch',
];

export default function Step12LoveLanguages({ onNext, onBack }) {
  const [selected, setSelected] = useState(
    JSON.parse(localStorage.getItem('loveLanguages')) || []
  );
  const [loading, setLoading] = useState(false);

  const toggleLanguage = (lang) => {
    setSelected((prev) =>
      prev.includes(lang)
        ? prev.filter((l) => l !== lang)
        : prev.length < 2
        ? [...prev, lang]
        : prev
    );
  };

  const handleContinue = () => {
    setLoading(true);
    setTimeout(() => {
      saveAnswer('loveLanguages', selected);
      setLoading(false);
      onNext();
    }, 500);
  };

  return (
    <div className="space-y-6">
      <ProgressBar step={12} totalSteps={24} />

      <label className="block text-xl font-bold text-pink-600">
        Which love languages resonate with you?
      </label>

      <p className="text-sm text-gray-500">
        Choose up to 2 that feel most important to receive from a partner.
      </p>

      <div className="flex flex-wrap gap-2">
        {loveLanguages.map((lang) => (
          <button
            key={lang}
            type="button"
            onClick={() => toggleLanguage(lang)}
            className={`px-4 py-2 rounded-full border transition ${
              selected.includes(lang)
                ? 'bg-pink-500 text-white border-pink-500'
                : 'bg-white text-gray-700 hover:border-pink-300'
            }`}
          >
            {lang}
          </button>
        ))}
      </div>

      <ValueCue cue="This helps ARIA understand how you express and receive love." />

      <NavigationButtons
        onBack={onBack}
        onNext={handleContinue}
        loading={loading}
        disabledNext={selected.length === 0}
        nextLabel="Continue →"
      />
    </div>
  );
}
