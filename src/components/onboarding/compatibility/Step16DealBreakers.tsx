// src/components/onboarding/compatibility/Step16DealBreakers.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ValueCue from '../../ValueCue';
import ProgressBar from '@/components/common/ProgressBar';
import { saveAnswer } from '@/lib/saveAnswer';

interface DealBreaker {
  value: string;
  severity: 'hard' | 'soft';
}

interface Step16Props {
  onNext: () => void;
}

const dealBreakerOptions: string[] = [
  "Smoking 🚬",
  "Drinking heavily 🍻",
  "Open relationships 🧑‍🧑‍🧑",
  "No desire for kids ❌👶",
  "No religious/spiritual beliefs",
  "Excessive screen time 📱",
  "Different political views 🕳️",
  "Not wanting marriage 💍",
];

export default function Step16DealBreakers({ onNext }: Step16Props) {
  const [selected, setSelected] = useState<DealBreaker[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('dealBreakers');
    if (saved) {
      try {
        const parsed: DealBreaker[] = JSON.parse(saved);
        setSelected(parsed);
      } catch (err) {
        console.warn('❌ Error parsing dealBreakers from localStorage:', err);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('dealBreakers', JSON.stringify(selected));
  }, [selected]);

  const isSelected = (option: string): boolean =>
    selected.some((item) => item.value === option);

  const getSeverity = (option: string): 'hard' | 'soft' =>
    selected.find((item) => item.value === option)?.severity || 'hard';

  const toggleOption = (option: string) => {
    setSelected((prev) => {
      const exists = prev.find((item) => item.value === option);
      return exists
        ? prev.filter((item) => item.value !== option)
        : [...prev, { value: option, severity: 'hard' }];
    });
  };

  const toggleSeverity = (option: string) => {
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
    saveAnswer('dealBreakers', selected);
    onNext();
  };

  Step16DealBreakers.handleNext = handleContinue;

  return (
    <div className="space-y-6 pb-32">
      <ProgressBar step={16} totalSteps={24} />

      <h2 className="text-2xl font-bold text-gray-800">
        Do you have any deal breakers?
      </h2>

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

      {selected.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-6"
        >
          <ValueCue cue="Being honest about your non-negotiables helps prevent heartbreak later. ARIA will filter accordingly." />
        </motion.div>
      )}
    </div>
  );
}
