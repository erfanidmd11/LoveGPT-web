// src/components/onboarding/Lifestyle/Step14CommunicationStyle.js
import React, { useState } from 'react';
import ValueCue from '../../ValueCue';
import ProgressBar from '@/components/common/ProgressBar';
import NavigationButtons from '@/components/common/NavigationButtons';
import { saveAnswer } from '@/lib/saveAnswer';

const styles = [
  { value: 'direct', label: '🔊 Direct – I speak my mind openly' },
  { value: 'thoughtful', label: '📚 Thoughtful – I choose my words carefully' },
  { value: 'lighthearted', label: '😂 Lighthearted – I use humor or playfulness' },
  { value: 'reserved', label: '🤫 Reserved – I express more through actions than words' },
  { value: 'emotional', label: '💖 Emotional – I’m expressive and passionate' },
];

export default function Step14CommunicationStyle({ onNext, onBack }) {
  const [selected, setSelected] = useState(localStorage.getItem('communicationStyle') || '');
  const [loading, setLoading] = useState(false);

  const handleSelect = (value) => {
    setSelected(value);
    saveAnswer('communicationStyle', value);
  };

  const handleContinue = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onNext();
    }, 500);
  };

  return (
    <div className="space-y-6">
      <ProgressBar step={14} totalSteps={24} />

      <h2 className="text-2xl font-bold text-gray-800">
        What’s your communication style? 🗣️
      </h2>

      <ValueCue cue="Knowing this helps ARIA match you with someone who gets how you speak and connect." />

      <div className="space-y-3">
        {styles.map((style) => (
          <button
            key={style.value}
            onClick={() => handleSelect(style.value)}
            className={`w-full text-left px-4 py-3 rounded-xl border transition ${
              selected === style.value
                ? 'bg-blue-100 border-blue-400 text-blue-800'
                : 'bg-white border-gray-300 hover:border-pink-400'
            }`}
          >
            {style.label}
          </button>
        ))}
      </div>

      <NavigationButtons
        onBack={onBack}
        onNext={handleContinue}
        loading={loading}
        disabledNext={!selected}
        nextLabel="Continue →"
      />
    </div>
  );
}
