import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ValueCue from '../../ValueCue';
import ProgressBar from '@/components/common/ProgressBar';
import { saveAnswer } from '@/lib/saveAnswer';

interface StepProps {
  onNext: () => void;
}

const options = [
  { label: "Very Open – I love trying new things and exploring unknowns", value: "very" },
  { label: "Open – I enjoy variety but need a little comfort zone", value: "moderate" },
  { label: "Selective – I prefer what I know and trust", value: "selective" },
  { label: "Cautious – New situations make me uneasy", value: "low" }
];

const Step24OpennessLevel: React.FC<StepProps> & { handleNext?: () => void } = ({ onNext }) => {
  const [openness, setOpenness] = useState<string>('');

  useEffect(() => {
    const saved = localStorage.getItem('opennessLevel');
    if (saved) setOpenness(saved);
  }, []);

  const handleChange = (value: string) => {
    setOpenness(value);
    localStorage.setItem('opennessLevel', value);
    saveAnswer('opennessLevel', value);
  };

  const handleContinue = () => {
    if (!openness) {
      alert("Please select how open you consider yourself 💫");
      return;
    }
    onNext();
  };

  Step24OpennessLevel.handleNext = handleContinue;

  return (
    <div className="space-y-6 pb-32">
      <ProgressBar step={24} totalSteps={25} />

      <h2 className="text-2xl font-bold text-pink-600">
        How open are you to new experiences, perspectives, and people?
      </h2>

      <div className="space-y-3">
        {options.map(({ label, value }) => (
          <label
            key={value}
            className={`block border rounded-xl px-4 py-3 cursor-pointer transition ${
              openness === value
                ? 'border-pink-500 bg-pink-50'
                : 'border-pink-200 hover:border-pink-400'
            }`}
          >
            <input
              type="radio"
              name="openness"
              value={value}
              checked={openness === value}
              onChange={() => handleChange(value)}
              className="mr-3 accent-pink-500"
            />
            {label}
          </label>
        ))}
      </div>

      {openness && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-6"
        >
          <ValueCue cue="Openness influences how you explore intimacy, growth, and emotional depth. ARIA uses this to fine-tune compatibility." />
        </motion.div>
      )}
    </div>
  );
};

export default Step24OpennessLevel;
