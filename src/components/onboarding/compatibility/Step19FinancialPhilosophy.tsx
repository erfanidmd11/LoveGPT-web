// src/components/onboarding/compatibility/Step19FinancialPhilosophy.tsx

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ValueCue from '../../ValueCue';
import ProgressBar from '@/components/common/ProgressBar';
import { saveAnswer } from '@/lib/saveAnswer';

interface FinancialOption {
  label: string;
  description: string;
}

interface Step19Props {
  onNext: () => void;
}

const philosophies: FinancialOption[] = [
  { label: "Saver 🐿️", description: "I value budgeting and saving for the future. I avoid unnecessary expenses." },
  { label: "Spender 💸", description: "I believe money is meant to be enjoyed. I treat myself often and live in the moment." },
  { label: "Investor 📈", description: "I see money as a tool for building long-term wealth. I take calculated risks." },
  { label: "Provider 🛡️", description: "I enjoy taking financial responsibility for my loved ones and offering stability." },
  { label: "Partnership 💞", description: "I believe in sharing financial roles and making joint money decisions with my partner." },
  { label: "Still figuring it out 🤷", description: "I'm working on finding the right balance with money that feels good and sustainable." },
];

export default function Step19FinancialPhilosophy({ onNext }: Step19Props) {
  const [selected, setSelected] = useState<string>('');

  useEffect(() => {
    const saved = localStorage.getItem('financialPhilosophy');
    if (saved) {
      setSelected(saved);
    }
  }, []);

  const handleSelect = (value: string) => {
    setSelected(value);
    localStorage.setItem('financialPhilosophy', value);
    saveAnswer('financialPhilosophy', value);
  };

  const handleContinue = () => {
    if (!selected) return;
    onNext();
  };

  Step19FinancialPhilosophy.handleNext = handleContinue;

  return (
    <div className="space-y-6 pb-32">
      <ProgressBar step={19} totalSteps={24} />

      <h2 className="text-2xl font-bold text-gray-800">What’s Your Financial Philosophy?</h2>

      <div className="space-y-3">
        {philosophies.map((item) => (
          <button
            key={item.label}
            onClick={() => handleSelect(item.label)}
            className={`w-full border rounded-xl px-4 py-3 text-left transition ${
              selected === item.label
                ? 'bg-green-100 border-green-500'
                : 'bg-white border-gray-300 hover:border-pink-300'
            }`}
          >
            <div className="font-semibold">{item.label}</div>
            <div className="text-sm text-gray-600">{item.description}</div>
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
          <ValueCue cue="Your relationship with money plays a key role in future harmony, stability, and shared goals." />
        </motion.div>
      )}
    </div>
  );
}
