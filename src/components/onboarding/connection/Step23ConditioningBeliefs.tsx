// src/components/onboarding/connection/Step23ConditioningBeliefs.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ValueCue from '../../ValueCue';
import ProgressBar from '@/components/common/ProgressBar';
import { saveAnswer } from '@/lib/saveAnswer';

interface Step23Props {
  onNext: () => void;
}

export default function Step23ConditioningBeliefs({ onNext }: Step23Props) {
  const [beliefs, setBeliefs] = useState<string>('');
  const [releaseReady, setReleaseReady] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const savedBeliefs = localStorage.getItem('conditionedBeliefs') || '';
    const savedReady = localStorage.getItem('readyToReleaseBeliefs') === 'true';

    setBeliefs(savedBeliefs);
    setReleaseReady(savedReady);
  }, []);

  const handleBeliefsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setBeliefs(value);
    localStorage.setItem('conditionedBeliefs', value);
  };

  const handleCheckboxToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    const checked = e.target.checked;
    setReleaseReady(checked);
    localStorage.setItem('readyToReleaseBeliefs', checked.toString());
  };

  const handleContinue = () => {
    if (beliefs.trim().length < 10) {
      setError("Please share a bit more about what you were conditioned to believe ❤️‍🩹");
      return;
    }

    setError('');
    saveAnswer('conditionedBeliefs', beliefs);
    saveAnswer('readyToReleaseBeliefs', releaseReady.toString());
    onNext();
  };

  Step23ConditioningBeliefs.handleNext = handleContinue;

  return (
    <div className="space-y-6 pb-32">
      <ProgressBar step={23} totalSteps={24} />

      <h2 className="text-2xl font-bold text-pink-600">
        What beliefs have you been conditioned to hold about love or yourself?
      </h2>

      <textarea
        value={beliefs}
        onChange={handleBeliefsChange}
        placeholder="Examples: 'Love has to be earned', 'I'm not worthy of being chosen', 'Men always leave'..."
        className="w-full border border-pink-200 rounded-xl px-4 py-3 min-h-[120px] focus:outline-pink-500"
      />

      <label className="flex items-center space-x-3 text-sm text-gray-700">
        <input
          type="checkbox"
          checked={releaseReady}
          onChange={handleCheckboxToggle}
          className="accent-pink-500"
        />
        <span>I'm ready to release these beliefs and rewire how I love.</span>
      </label>

      {error && (
        <p className="text-sm text-red-500 italic">{error}</p>
      )}

      {(beliefs.length > 0 || releaseReady) && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-4"
        >
          <ValueCue cue="These hidden programs shape how you attach, react, and choose. Awareness is the beginning of emotional mastery. ARIA will help you evolve." />
        </motion.div>
      )}
    </div>
  );
}
