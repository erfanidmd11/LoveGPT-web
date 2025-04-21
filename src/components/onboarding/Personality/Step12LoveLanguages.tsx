import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ValueCue from '../../ValueCue';
import ProgressBar from '@/components/common/ProgressBar';
import { saveAnswer } from '@/lib/saveAnswer';

interface StepProps {
  onNext: () => void;
}

const loveLanguages = [
  'Words of Affirmation',
  'Acts of Service',
  'Receiving Gifts',
  'Quality Time',
  'Physical Touch',
];

const Step12LoveLanguages: React.FC<StepProps> & { handleNext?: () => void } = ({ onNext }) => {
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('loveLanguages');
    if (saved) {
      setSelected(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('loveLanguages', JSON.stringify(selected));
  }, [selected]);

  const toggleLanguage = (lang: string) => {
    setSelected((prev) =>
      prev.includes(lang)
        ? prev.filter((l) => l !== lang)
        : prev.length < 2
        ? [...prev, lang]
        : prev
    );
  };

  const handleContinue = () => {
    if (selected.length === 0) {
      alert('Please select at least one love language.');
      return;
    }
    saveAnswer('loveLanguages', selected);
    onNext();
  };

  Step12LoveLanguages.handleNext = handleContinue;

  return (
    <div className="space-y-6 pb-40">
      <ProgressBar step={12} totalSteps={25} />

      <label className="block text-xl font-bold text-pink-600">
        Which love languages resonate with you?
      </label>

      <p className="text-sm text-gray-500">
        Choose up to 2 that feel most important to receive from a partner.
      </p>

      <div className="flex flex-wrap gap-2">
        {loveLanguages.map((lang) => (
          <button
            key={lang}
            type="button"
            onClick={() => toggleLanguage(lang)}
            className={`px-4 py-2 rounded-full border transition ${
              selected.includes(lang)
                ? 'bg-pink-500 text-white border-pink-500'
                : 'bg-white text-gray-700 hover:border-pink-300'
            }`}
          >
            {lang}
          </button>
        ))}
      </div>

      {selected.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="pt-4"
        >
          <ValueCue cue="This helps ARIA understand how you express and receive love." />
        </motion.div>
      )}

      {selected.length === 0 && (
        <p className="text-sm text-red-500 italic">
          Please select at least one love language to continue.
        </p>
      )}
    </div>
  );
};

export default Step12LoveLanguages;
