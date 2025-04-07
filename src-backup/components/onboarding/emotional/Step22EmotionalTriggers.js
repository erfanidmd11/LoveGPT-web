// src/components/onboarding/emotional/Step22EmotionalTriggers.js
import React, { useState } from 'react';
import ValueCue from '../../ValueCue';
import ProgressBar from '@/components/common/ProgressBar';
import NavigationButtons from '@/components/common/NavigationButtons';
import { saveAnswer } from '@/lib/saveAnswer';

const triggerOptions = [
  "Abandonment or Rejection",
  "Criticism or Judgment",
  "Being Ignored or Not Heard",
  "Feeling Controlled",
  "Conflict or Confrontation",
  "Failure or Disapproval",
  "Being Compared",
  "Feeling Unworthy or Not Enough",
];

export default function Step22EmotionalTriggers({ onNext, onBack }) {
  const [selected, setSelected] = useState(
    JSON.parse(localStorage.getItem('emotionalTriggers')) || []
  );
  const [loading, setLoading] = useState(false);

  const handleToggle = (trigger) => {
    setSelected((prev) =>
      prev.includes(trigger)
        ? prev.filter((t) => t !== trigger)
        : [...prev, trigger]
    );
  };

  const handleContinue = () => {
    setLoading(true);
    saveAnswer('emotionalTriggers', selected);
    setTimeout(() => {
      setLoading(false);
      onNext();
    }, 1000);
  };

  return (
    <div>
      <ProgressBar step={22} totalSteps={24} />

      <h2 className="text-2xl font-bold text-pink-600 mb-4">
        Emotional Triggers & Healing Awareness 💔🌱
      </h2>

      <p className="text-gray-700 mb-4">
        Which emotional triggers do you recognize in yourself? These don’t define you, but help us understand where you’re healing.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {triggerOptions.map((trigger) => (
          <button
            key={trigger}
            onClick={() => handleToggle(trigger)}
            className={`border px-4 py-2 rounded-xl transition ${
              selected.includes(trigger)
                ? 'bg-pink-500 text-white border-pink-600'
                : 'bg-white text-gray-800 hover:bg-pink-50'
            }`}
          >
            {trigger}
          </button>
        ))}
      </div>

      <ValueCue cue="Self-awareness about your emotional patterns creates space for deeper, safer relationships." />

      <NavigationButtons
        onBack={onBack}
        onNext={handleContinue}
        loading={loading}
        disabledNext={selected.length === 0}
        nextLabel="Continue"
      />
    </div>
  );
}
