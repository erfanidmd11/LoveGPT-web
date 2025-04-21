import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ValueCue from '../../ValueCue';
import ProgressBar from '@/components/common/ProgressBar';
import { saveAnswer } from '@/lib/saveAnswer';

type CommunicationStyleOption = {
  value: string;
  label: string;
};

const styles: CommunicationStyleOption[] = [
  { value: 'direct', label: '🔊 Direct – I speak my mind openly' },
  { value: 'thoughtful', label: '📚 Thoughtful – I choose my words carefully' },
  { value: 'lighthearted', label: '😂 Lighthearted – I use humor or playfulness' },
  { value: 'reserved', label: '🤫 Reserved – I express more through actions than words' },
  { value: 'emotional', label: '💖 Emotional – I’m expressive and passionate' },
];

interface StepProps {
  onNext: () => void;
}

export default function Step14CommunicationStyle({ onNext }: StepProps) {
  const [selected, setSelected] = useState<string>('');

  useEffect(() => {
    const saved = localStorage.getItem('communicationStyle');
    if (saved) {
      setSelected(saved);
    }
  }, []);

  const handleSelect = (value: string) => {
    setSelected(value);
    saveAnswer('communicationStyle', value);
    localStorage.setItem('communicationStyle', value);
  };

  const handleContinue = () => {
    if (!selected) return;
    onNext(); // Trigger global nav
  };

  Step14CommunicationStyle.handleNext = handleContinue;

  return (
    <div className="space-y-6 pb-32">
      <ProgressBar step={14} totalSteps={24} />

      <h2 className="text-2xl font-bold text-gray-800">
        What’s your communication style? 🗣️
      </h2>

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

      {selected && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-6"
        >
          <ValueCue cue="Knowing this helps ARIA match you with someone who gets how you speak and connect." />
        </motion.div>
      )}
    </div>
  );
}
