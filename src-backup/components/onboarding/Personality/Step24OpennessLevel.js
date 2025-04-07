// src/components/onboarding/Personality/StepXOpennessLevel.js
import React, { useState } from 'react';
import ValueCue from '../../ValueCue';
import ProgressBar from '@/components/common/ProgressBar';
import NavigationButtons from '@/components/common/NavigationButtons';
import { saveAnswer } from '@/lib/saveAnswer';

export default function StepXOpennessLevel({ onNext, onBack }) {
  const [openness, setOpenness] = useState(localStorage.getItem('opennessLevel') || '');
  const [loading, setLoading] = useState(false);

  const handleContinue = () => {
    if (!openness) {
      alert("Please select how open you consider yourself 💫");
      return;
    }

    setLoading(true);
    saveAnswer('opennessLevel', openness);

    setTimeout(() => {
      setLoading(false);
      onNext();
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <ProgressBar step={24} totalSteps={24} />

      <h2 className="text-2xl font-bold text-pink-600">
        How open are you to new experiences, perspectives, and people?
      </h2>

      <div className="space-y-3">
        {[
          { label: "Very Open – I love trying new things and exploring unknowns", value: "very" },
          { label: "Open – I enjoy variety but need a little comfort zone", value: "moderate" },
          { label: "Selective – I prefer what I know and trust", value: "selective" },
          { label: "Cautious – New situations make me uneasy", value: "low" }
        ].map(({ label, value }) => (
          <label
            key={value}
            className="block border border-pink-200 rounded-xl px-4 py-3 cursor-pointer hover:border-pink-400"
          >
            <input
              type="radio"
              name="openness"
              value={value}
              checked={openness === value}
              onChange={() => setOpenness(value)}
              className="mr-3 accent-pink-500"
            />
            {label}
          </label>
        ))}
      </div>

      <ValueCue cue="Openness influences how you explore intimacy, growth, and emotional depth. ARIA uses this to fine-tune compatibility." />

      <NavigationButtons
        onBack={onBack}
        onNext={handleContinue}
        loading={loading}
        disabledNext={!openness}
        nextLabel="Finish"
      />
    </div>
  );
}
