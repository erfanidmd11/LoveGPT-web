import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ValueCue from '../../ValueCue';
import ProgressBar from '@/components/common/ProgressBar';
import { saveAnswer } from '@/lib/saveAnswer';

const resolutionOptions: string[] = [
  "Talk immediately and resolve it fully",
  "Take space, then come back calmly",
  "Write it out in a message first",
  "Let it go unless it's serious",
  "Go to therapy or ask for outside help"
];

interface StepProps {
  onNext: () => void;
}

export default function Step20ConflictResolution({ onNext }: StepProps) {
  const [selected, setSelected] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const saved = localStorage.getItem('conflictResolution');
    if (saved) setSelected(saved);
  }, []);

  const handleSelect = (value: string) => {
    setSelected(value);
    localStorage.setItem('conflictResolution', value);
    saveAnswer('conflictResolution', value);
  };

  const handleContinue = () => {
    if (!selected) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onNext();
    }, 1000);
  };

  // Expose for global nav
  Step20ConflictResolution.handleNext = handleContinue;

  return (
    <div className="space-y-6 pb-32">
      <ProgressBar step={20} totalSteps={24} />

      <h2 className="text-2xl font-bold text-pink-600">
        What’s your preferred way to resolve a disagreement?
      </h2>

      <div className="grid gap-3">
        {resolutionOptions.map((option) => (
          <button
            key={option}
            onClick={() => handleSelect(option)}
            className={`border px-4 py-2 rounded-xl transition ${
              selected === option
                ? 'bg-pink-100 border-pink-400'
                : 'bg-white border-gray-300 hover:border-pink-300'
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      {selected && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-6"
        >
          <ValueCue cue="Your repair style matters more than your conflict. We'll help match you with someone whose resolution rhythm suits yours." />
        </motion.div>
      )}

      {loading && <p className="text-sm text-gray-500">Saving...</p>}
    </div>
  );
}
