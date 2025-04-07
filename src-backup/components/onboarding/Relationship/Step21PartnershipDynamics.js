// src/components/onboarding/Relationship/Step21PartnershipDynamics.js
import React, { useState } from 'react';
import ValueCue from '../../ValueCue';
import ProgressBar from '@/components/common/ProgressBar';
import NavigationButtons from '@/components/common/NavigationButtons';
import { saveAnswer } from '@/lib/saveAnswer';

const dynamicOptions = [
  {
    label: '💞 I want an emotionally balanced, equal partnership.',
    value: 'equal-partnership',
  },
  {
    label: '🤱 I prefer to be the nurturer/caregiver in the relationship.',
    value: 'nurturer-role',
  },
  {
    label: '🛡️ I prefer to be the provider/protector in the relationship.',
    value: 'provider-role',
  },
  {
    label: '🌈 I want a fluid and evolving dynamic — we grow into roles together.',
    value: 'fluid-dynamic',
  },
  {
    label: '🧠 I want intellectual partnership — two minds building something great.',
    value: 'intellectual-partnership',
  },
  {
    label: '🌀 I’m still discovering what I need from a partner.',
    value: 'unsure',
  },
];

export default function Step21PartnershipDynamics({ onNext, onBack }) {
  const [selected, setSelected] = useState(localStorage.getItem('partnershipDynamic') || '');
  const [loading, setLoading] = useState(false);

  const handleContinue = () => {
    setLoading(true);
    saveAnswer('partnershipDynamic', selected);
    setTimeout(() => {
      setLoading(false);
      onNext();
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <ProgressBar step={21} totalSteps={24} />

      <h2 className="text-2xl font-bold text-gray-800">What Type of Partnership Feels Best for You?</h2>
      <ValueCue cue="Knowing your desired relationship dynamic helps us match you with someone who aligns with your love energy." />

      <div className="space-y-3">
        {dynamicOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => setSelected(option.value)}
            className={`w-full border rounded-xl px-4 py-3 text-left transition ${
              selected === option.value
                ? 'bg-blue-100 border-blue-500'
                : 'bg-white border-gray-300'
            }`}
          >
            {option.label}
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
