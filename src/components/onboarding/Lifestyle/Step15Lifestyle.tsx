import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ValueCue from '../../ValueCue';
import ProgressBar from '@/components/common/ProgressBar';
import { saveAnswer } from '@/lib/saveAnswer';

const lifestyleOptions = [
  { label: "🌱 Balanced — I value both rest and productivity", value: "balanced" },
  { label: "💼 Hustle — I'm highly driven and achievement-oriented", value: "hustle" },
  { label: "🧘‍♀️ Flow — I prioritize presence, peace, and wellbeing", value: "flow" },
  { label: "🌎 Adventure — I love travel, risk-taking, and pushing limits", value: "adventure" },
  { label: "🏡 Rooted — I enjoy stability, tradition, and home life", value: "grounded" },
];

export default function Step15Lifestyle({ onNext }: { onNext: () => void }) {
  const [selected, setSelected] = useState('');
  const [error, setError] = useState('');

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('lifestyleNow');
    if (saved) setSelected(saved);
  }, []);

  const handleSelect = (value: string) => {
    setSelected(value);
    setError('');
    localStorage.setItem('lifestyleNow', value);
    saveAnswer('lifestyleNow', value);
  };

  const handleContinue = () => {
    if (!selected) {
      setError('Please select your current lifestyle before continuing.');
      return;
    }
    onNext();
  };

  Step15Lifestyle.handleNext = handleContinue;

  return (
    <div className="space-y-6 pb-32">
      <ProgressBar step={15} totalSteps={25} />

      <h2 className="text-2xl font-bold text-pink-600">
        Which of these best describes your current lifestyle?
      </h2>

      <p className="text-sm text-gray-500">
        Choose the one that feels most aligned with your pace of life right now.
      </p>

      <div className="grid gap-3">
        {lifestyleOptions.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => handleSelect(value)}
            className={`border px-4 py-3 rounded-xl text-left transition-all duration-300 ${
              selected === value
                ? 'bg-blue-100 border-blue-400 text-blue-800 font-medium'
                : 'bg-white hover:border-pink-300'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {selected && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-4"
        >
          <ValueCue cue="Understanding your lifestyle helps ARIA align matches based on pace, priorities, and compatibility rhythm." />
        </motion.div>
      )}

      {error && (
        <p className="text-red-500 text-sm mt-2">{error}</p>
      )}
    </div>
  );
}
