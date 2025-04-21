import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ValueCue from '../../ValueCue';
import ProgressBar from '@/components/common/ProgressBar';
import { saveAnswer } from '@/lib/saveAnswer';

interface Option {
  label: string;
  value: string;
}

interface StepProps {
  onNext: () => void;
}

const dynamicOptions: Option[] = [
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

const Step21PartnershipDynamics: React.FC<StepProps> & { handleNext?: () => void } = ({ onNext }) => {
  const [selected, setSelected] = useState<string>('');

  useEffect(() => {
    const saved = localStorage.getItem('partnershipDynamic');
    if (saved) setSelected(saved);
  }, []);

  const handleSelect = (value: string) => {
    setSelected(value);
    localStorage.setItem('partnershipDynamic', value);
    saveAnswer('partnershipDynamic', value);
  };

  const handleContinue = () => {
    if (selected) {
      onNext();
    }
  };

  Step21PartnershipDynamics.handleNext = handleContinue;

  return (
    <div className="space-y-6 pb-32">
      <ProgressBar step={21} totalSteps={25} />

      <h2 className="text-2xl font-bold text-gray-800">
        What Type of Partnership Feels Best for You?
      </h2>

      <div className="space-y-3">
        {dynamicOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => handleSelect(option.value)}
            className={`w-full border rounded-xl px-4 py-3 text-left transition ${
              selected === option.value
                ? 'bg-blue-100 border-blue-500'
                : 'bg-white border-gray-300 hover:border-pink-300'
            }`}
          >
            {option.label}
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
          <ValueCue cue="Knowing your desired relationship dynamic helps us match you with someone who aligns with your love energy." />
        </motion.div>
      )}
    </div>
  );
};

export default Step21PartnershipDynamics;
