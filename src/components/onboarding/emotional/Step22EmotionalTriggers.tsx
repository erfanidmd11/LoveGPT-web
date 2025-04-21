// src/components/onboarding/emotional/Step22EmotionalTriggers.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ValueCue from '../../ValueCue';
import ProgressBar from '@/components/common/ProgressBar';
import { saveAnswer } from '@/lib/saveAnswer';

const triggerOptions = [
  'Abandonment or Rejection',
  'Criticism or Judgment',
  'Being Ignored or Not Heard',
  'Feeling Controlled',
  'Conflict or Confrontation',
  'Failure or Disapproval',
  'Being Compared',
  'Feeling Unworthy or Not Enough',
];

export default function Step22EmotionalTriggers({ onNext }) {
  const [selected, setSelected] = useState<string[]>([]);

  // 🔁 Load saved state on mount
  useEffect(() => {
    const saved = localStorage.getItem('emotionalTriggers');
    if (saved) {
      try {
        setSelected(JSON.parse(saved));
      } catch (err) {
        console.warn('⚠️ Error parsing emotionalTriggers:', err);
      }
    }
  }, []);

  // ✅ Toggle a trigger on/off
  const handleToggle = (trigger: string) => {
    const updated = selected.includes(trigger)
      ? selected.filter((t) => t !== trigger)
      : [...selected, trigger];

    setSelected(updated);
    localStorage.setItem('emotionalTriggers', JSON.stringify(updated));
    saveAnswer('emotionalTriggers', updated);
  };

  // ✅ Navigation handler
  const handleContinue = () => {
    if (selected.length === 0) return;
    onNext();
  };

  // Expose for global nav logic
  Step22EmotionalTriggers.handleNext = handleContinue;

  return (
    <div className="space-y-6 pb-32">
      <ProgressBar step={22} totalSteps={24} />

      <h2 className="text-2xl font-bold text-pink-600">
        Emotional Triggers & Healing Awareness 💔🌱
      </h2>

      <p className="text-gray-700">
        Which emotional triggers do you recognize in yourself?
        <br />
        These don’t define you — they help ARIA understand your healing style and support your relationship safety.
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

      {selected.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-6"
        >
          <ValueCue cue="Self-awareness about your emotional patterns creates space for deeper, safer relationships." />
        </motion.div>
      )}
    </div>
  );
}
