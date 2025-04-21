// src/components/onboarding/compatibility/Step17ConflictStyle.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ValueCue from '../../ValueCue';
import ProgressBar from '@/components/common/ProgressBar';
import { saveAnswer } from '@/lib/saveAnswer';

interface StepProps {
  onNext: () => void;
}

const options: string[] = [
  "I go silent or retreat",
  "I raise my voice or get defensive",
  "I over-explain or try to fix it fast",
  "I stay calm but shut down later",
  "I listen first, then respond with care"
];

export default function Step17ConflictStyle({ onNext }: StepProps) {
  const [selected, setSelected] = useState<string>('');

  useEffect(() => {
    const saved = localStorage.getItem('conflictStyle');
    if (saved) setSelected(saved);
  }, []);

  const handleSelect = (value: string) => {
    setSelected(value);
    saveAnswer('conflictStyle', value);
    localStorage.setItem('conflictStyle', value);
  };

  const handleContinue = () => {
    if (!selected) return;
    onNext();
  };

  Step17ConflictStyle.handleNext = handleContinue;

  return (
    <div className="space-y-6 pb-32">
      <ProgressBar step={17} totalSteps={24} />

      <h2 className="text-2xl font-bold text-pink-600">
        In conflict with others, how do you usually react?
      </h2>

      <div className="grid gap-3">
        {options.map((option) => (
          <button
            key={option}
            onClick={() => handleSelect(option)}
            className={`border px-4 py-2 rounded-xl transition ${
              selected === option ? 'bg-pink-100 border-pink-400' : 'hover:border-pink-300'
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
          transition={{ duration: 0.4 }}
          className="mt-6"
        >
          <ValueCue cue="Understanding your conflict style helps match you with someone whose nervous system complements—not clashes with—yours." />
        </motion.div>
      )}
    </div>
  );
}
