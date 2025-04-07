// src/components/onboarding/compatibility/Step16DealBreakers.js
import React, { useState } from 'react';
import ValueCue from '../../ValueCue';
import ProgressBar from '@/components/common/ProgressBar';
import NavigationButtons from '@/components/common/NavigationButtons';
import { saveAnswer } from '@/lib/saveAnswer';

const dealBreakerOptions = [
  "Smoking 🚬",
  "Drinking heavily 🍻",
  "Open relationships 🧑‍🧑‍🧑",
  "No desire for kids ❌👶",
  "No religious/spiritual beliefs",
  "Excessive screen time 📱",
  "Different political views 🕳️",
  "Not wanting marriage 💍",
];

export default function Step16DealBreakers({ onNext, onBack }) {
  const [selected, setSelected] = useState(
    JSON.parse(localStorage.getItem('dealBreakers')) || []
  );
  const [loading, setLoading] = useState(false);

  const isSelected = (option) => selected.some((item) => item.value === option);
  const getSeverity = (option) =>
    selected.find((item) => item.value === option)?.severity || 'hard';

  const toggleOption = (option) => {
    setSelected((prev) => {
      const exists = prev.find((item) => item.value === option);
      return exists
        ? prev.filter((item) => item.value !== option)
        : [...prev, { value: option, severity: 'hard' }];
    });
  };

  const toggleSeverity = (option) => {
    setSelected((prev) =>
      prev.map((item) =>
        item.value === option
          ? {
              ...item,
              severity: item.severity === 'hard' ? 'soft' : 'hard',
            }
          : item
      )
    );
  };

  const handleContinue = () => {
    setLoading(true);
    setTimeout(() => {
      saveAnswer('dealBreakers', selected);
      setLoading(false);
      onNext();
    }, 500);
  };

  return (
    <div className="space-y-6">
      <ProgressBar step={16} totalSteps={24} />

      <h2 className="text-2xl font-bold text-gray-800">
        Do you have any deal breakers?
      </h2>

      <ValueCue cue="Being honest about your non-negotiables helps prevent heartbreak later. ARIA will filter accordingly." />

      <div className="space-y-2">
        {dealBreakerOptions.map((option) => (
          <div key={option} className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => toggleOption(option)}
              className={`flex-1 text-left px-4 py-2 border rounded-xl transition ${
                isSelected(option)
                  ? 'bg-red-100 border-red-500 font-medium'
                  : 'bg-white border-gray-300 hover:border-pink-300'
              }`}
            >
              {option}
            </button>
            {isSelected(option) && (
              <button
                type="button"
                onClick={() => toggleSeverity(option)}
                className={`text-xs px-2 py-1 rounded-lg font-medium ${
                  getSeverity(option) === 'hard'
                    ? 'bg-red-500 text-white'
                    : 'bg-yellow-400 text-black'
                }`}
              >
                {getSeverity(option) === 'hard' ? 'Hard' : 'Soft'}
              </button>
            )}
          </div>
        ))}
      </div>

      <NavigationButtons
        onBack={onBack}
        onNext={handleContinue}
        loading={loading}
        disabledNext={false}
        nextLabel="Continue →"
      />
    </div>
  );
}
