// src/components/onboarding/compatibility/Step18AttachmentStyle.js
import React, { useState } from 'react';
import ValueCue from '../../ValueCue';
import ProgressBar from '@/components/common/ProgressBar';
import NavigationButtons from '@/components/common/NavigationButtons';

const attachmentStyles = [
  {
    label: "Secure 💚",
    description: "I’m comfortable with intimacy and trust. I can communicate openly and handle conflict calmly.",
  },
  {
    label: "Anxious 💛",
    description: "I crave closeness but worry I’m not truly loved. I need reassurance often.",
  },
  {
    label: "Avoidant 💙",
    description: "I value independence. I tend to pull away when things get emotionally intense.",
  },
  {
    label: "Fearful-Avoidant 💔",
    description: "I desire love but fear rejection. My reactions can feel inconsistent or confusing.",
  },
  {
    label: "Not sure yet 🤔",
    description: "I'm working on finding the right balance with money that feels good and sustainable.",
  },
];

export default function Step18AttachmentStyle({ formData, setFormData, onNext, onBack }) {
  const [selected, setSelected] = useState(formData.attachmentStyle || '');
  const [loading, setLoading] = useState(false);

  const handleSelect = (style) => {
    setSelected(style);
  };

  const handleContinue = () => {
    setLoading(true);
    setTimeout(() => {
      setFormData(prev => ({ ...prev, attachmentStyle: selected }));
      setLoading(false);
      onNext();
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <ProgressBar step={18} totalSteps={24} />

      <h2 className="text-2xl font-bold text-gray-800">Your Attachment Style</h2>
      <ValueCue cue="Understanding your emotional patterns helps ARIA match you with someone who complements your needs." />

      <div className="space-y-3">
        {attachmentStyles.map((style) => (
          <button
            key={style.label}
            onClick={() => handleSelect(style.label)}
            className={`w-full border rounded-xl px-4 py-3 text-left transition ${
              selected === style.label
                ? 'bg-blue-100 border-blue-500'
                : 'bg-white border-gray-300'
            }`}
          >
            <div className="font-semibold">{style.label}</div>
            <div className="text-sm text-gray-600">{style.description}</div>
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
