import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ValueCue from '../../ValueCue';
import ProgressBar from '@/components/common/ProgressBar';
import { saveAnswer } from '@/lib/saveAnswer';

interface StepProps {
  onNext: () => void;
}

const valuesList = ['Family', 'Faith', 'Career', 'Adventure', 'Stability', 'Creativity'];

const Step7Values: React.FC<StepProps> & { handleNext?: () => void } = ({ onNext }) => {
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('onboardingCoreValues');
    if (stored) {
      setSelectedValues(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('onboardingCoreValues', JSON.stringify(selectedValues));
  }, [selectedValues]);

  const toggleValue = (value: string) => {
    setSelectedValues((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  };

  const handleContinue = () => {
    if (selectedValues.length === 0) return;
    saveAnswer('onboardingCoreValues', selectedValues);
    onNext();
  };

  Step7Values.handleNext = handleContinue;

  return (
    <div className="space-y-6 pb-32">
      <ProgressBar step={7} totalSteps={25} />

      <label className="block text-xl font-bold text-pink-600">
        Which values guide your life?
      </label>

      <div className="flex flex-wrap gap-2">
        {valuesList.map((value) => (
          <button
            type="button"
            key={value}
            onClick={() => toggleValue(value)}
            className={`px-4 py-2 rounded-full border transition ${
              selectedValues.includes(value)
                ? 'bg-pink-500 text-white border-pink-500'
                : 'bg-white text-gray-700 hover:border-pink-400'
            }`}
          >
            {value}
          </button>
        ))}
      </div>

      {selectedValues.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-4"
        >
          <ValueCue cue="These values help ARIA align you with someone who shares your deeper life direction." />
        </motion.div>
      )}

      {selectedValues.length === 0 && (
        <p className="text-sm text-red-500 italic mt-2">
          Please select at least one value to continue.
        </p>
      )}
    </div>
  );
};

export default Step7Values;
