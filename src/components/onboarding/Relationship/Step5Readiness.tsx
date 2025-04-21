import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ValueCue from '../../ValueCue';
import { saveAnswer } from '@/lib/saveAnswer';
import ProgressBar from '@/components/common/ProgressBar';

interface StepProps {
  onNext: () => void;
}

interface ReadinessOption {
  label: string;
  value: string;
}

const readinessLevels: ReadinessOption[] = [
  {
    label: "Green — I’m emotionally available and ready to meet someone",
    value: "green",
  },
  {
    label: "Yellow — I’m open, but healing or cautious",
    value: "yellow",
  },
  {
    label: "Red — I’m uncertain or exploring myself first",
    value: "red",
  },
];

const Step5Readiness: React.FC<StepProps> & { handleNext?: () => void } = ({ onNext }) => {
  const [readiness, setReadiness] = useState<string>('');
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const saved = localStorage.getItem('readinessLevel');
    if (saved) {
      setReadiness(saved);
    }
  }, []);

  const handleContinue = () => {
    if (!readiness) {
      setError("Please select your current emotional readiness.");
      return;
    }

    saveAnswer('readinessLevel', readiness);
    onNext();
  };

  Step5Readiness.handleNext = handleContinue;

  return (
    <div className="space-y-6 pb-32">
      <ProgressBar step={5} totalSteps={25} />

      <h2 className="text-2xl font-bold text-pink-600">
        How emotionally ready are you?
      </h2>

      <select
        value={readiness}
        onChange={(e) => {
          setReadiness(e.target.value);
          setError('');
        }}
        className="w-full border border-pink-200 rounded-xl px-4 py-3 focus:outline-pink-500"
      >
        <option value="">Select your readiness level</option>
        {readinessLevels.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {readiness && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <ValueCue cue="We respect where you're at in your journey. This helps ARIA support your pace and emotional bandwidth." />
        </motion.div>
      )}

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
};

export default Step5Readiness;
