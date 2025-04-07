// src/components/onboarding/compatibility/Step19FinancialPhilosophy.js
import React, { useState } from 'react';
import ValueCue from '../../ValueCue';
import ProgressBar from '@/components/common/ProgressBar';
import NavigationButtons from '@/components/common/NavigationButtons';
import { saveAnswer } from '@/lib/saveAnswer';
const philosophies = [
  { label: "Saver 🐿️", description: "I value budgeting and saving for the future. I avoid unnecessary expenses." },
  { label: "Spender 💸", description: "I believe money is meant to be enjoyed. I treat myself often and live in the moment." },
  { label: "Investor 📈", description: "I see money as a tool for building long-term wealth. I take calculated risks." },
  { label: "Provider 🛡️", description: "I enjoy taking financial responsibility for my loved ones and offering stability." },
  { label: "Partnership 💞", description: "I believe in sharing financial roles and making joint money decisions with my partner." },
  { label: "Still figuring it out 🤷", description: "I'm working on finding the right balance with money that feels good and sustainable." },
];

export default function Step19FinancialPhilosophy({ onNext, onBack }) {
  const [selected, setSelected] = useState(localStorage.getItem('financialPhilosophy') || '');
  const [loading, setLoading] = useState(false);

  const handleSelect = (value) => {
    setSelected(value);
    saveAnswer('financialPhilosophy', value);
  };

  const handleContinue = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onNext();
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <ProgressBar step={19} totalSteps={24} />

      <h2 className="text-2xl font-bold text-gray-800">What’s Your Financial Philosophy?</h2>
      <ValueCue cue="Your relationship with money plays a key role in future harmony, stability, and shared goals." />

      <div className="space-y-3">
        {philosophies.map((item) => (
          <button
            key={item.label}
            onClick={() => handleSelect(item.label)}
            className={`w-full border rounded-xl px-4 py-3 text-left transition ${
              selected === item.label
                ? 'bg-green-100 border-green-500'
                : 'bg-white border-gray-300'
            }`}
          >
            <div className="font-semibold">{item.label}</div>
            <div className="text-sm text-gray-600">{item.description}</div>
          </button>
        ))}
      </div>

      <NavigationButtons
        onBack={onBack}
        onNext={handleContinue}
        loading={loading}
        disabledNext={!selected}
        nextLabel="Continue"
      />
    </div>
  );
}
