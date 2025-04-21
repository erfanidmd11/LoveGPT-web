import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { saveAnswer } from '@/lib/saveAnswer';
import ValueCue from '../../ValueCue';
import ProgressBar from '@/components/common/ProgressBar';

interface StepProps {
  onNext: () => void;
}

interface Option {
  label: string;
  value: string;
}

const intentionOptions: Option[] = [
  { label: "Long-Term Relationship", value: "long_term" },
  { label: "Marriage", value: "marriage" },
  { label: "Casual Dating", value: "casual" },
  { label: "Exploring Myself", value: "self_exploration" },
  { label: "Friendship & Emotional Connection", value: "friendship" },
];

const Step4Intention: React.FC<StepProps> & { handleNext?: () => void } = ({ onNext }) => {
  const [intention, setIntention] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('relationshipGoals') || '';
    setIntention(saved);

    const userDOB = localStorage.getItem('userDOB');
    if (userDOB) {
      const age = calculateAge(userDOB);
      if (age < 18) {
        window.location.href = '/';
      }
    }
  }, []);

  const calculateAge = (dob: string): number => {
    const birth = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const m = today.getMonth() - birth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const handleContinue = () => {
    if (!intention) {
      setError("Please select an intention to continue.");
      return;
    }

    saveAnswer('relationshipGoals', intention);
    localStorage.setItem('relationshipGoals', intention);
    onNext();
  };

  Step4Intention.handleNext = handleContinue;

  return (
    <div className="space-y-6 pb-32">
      <ProgressBar step={4} totalSteps={25} />

      <h2 className="text-2xl font-bold text-pink-600">What are you looking for?</h2>

      <select
        value={intention}
        onChange={(e) => {
          setIntention(e.target.value);
          setError('');
        }}
        className="w-full border border-pink-200 rounded-xl px-4 py-3 focus:outline-pink-500"
      >
        <option value="">Select your relationship intention</option>
        {intentionOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {intention && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <ValueCue cue="ARIA aligns your matches with shared values and long-term goals. This is your relationship compass." />
        </motion.div>
      )}

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
};

export default Step4Intention;
