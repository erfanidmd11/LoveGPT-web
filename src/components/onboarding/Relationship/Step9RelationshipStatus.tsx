import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ValueCue from '../../ValueCue';
import ProgressBar from '@/components/common/ProgressBar';
import { saveAnswer } from '@/lib/saveAnswer';

interface StepProps {
  onNext: () => void;
}

interface StatusOption {
  value: string;
  label: string;
}

const statusOptions: StatusOption[] = [
  { value: 'single', label: 'Single' },
  { value: 'divorced', label: 'Divorced' },
  { value: 'widowed', label: 'Widowed' },
  { value: 'inRelationship', label: 'In a Relationship' },
];

const cueMap: Record<string, string> = {
  single: "We'll match you with someone who's ready for love and alignment.",
  divorced: "We honor your past and help you rewrite your love story. 💫",
  widowed: "We'll gently prioritize empathy and emotional availability in your matches. 💛",
  inRelationship: "Even if you're exploring, ARIA will guide with integrity and intention.",
};

const strategyMap: Record<string, string> = {
  single: 'standard',
  divorced: 'resilience_match',
  widowed: 'empathy_match',
  inRelationship: 'awareness_only',
};

const Step9RelationshipStatus: React.FC<StepProps> & { handleNext?: () => void } = ({ onNext }) => {
  const [status, setStatus] = useState<string>('');

  useEffect(() => {
    const savedStatus = localStorage.getItem('relationshipStatus') || '';
    setStatus(savedStatus);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedStatus = e.target.value;
    setStatus(selectedStatus);
    localStorage.setItem('relationshipStatus', selectedStatus);
    saveAnswer('relationshipStatus', selectedStatus);
    saveAnswer('matchStrategy', strategyMap[selectedStatus]);
  };

  const handleContinue = () => {
    if (status) {
      onNext();
    }
  };

  Step9RelationshipStatus.handleNext = handleContinue;

  return (
    <div className="space-y-6 pb-32">
      <ProgressBar step={9} totalSteps={25} />

      <label className="block text-xl font-bold text-pink-600">
        What is your current relationship status?
      </label>

      <select
        value={status}
        onChange={handleChange}
        className="w-full border px-4 py-3 rounded-lg focus:outline-pink-500"
        required
      >
        <option value="">Select...</option>
        {statusOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {status && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-4"
        >
          <ValueCue cue={cueMap[status]} />
        </motion.div>
      )}
    </div>
  );
};

export default Step9RelationshipStatus;
