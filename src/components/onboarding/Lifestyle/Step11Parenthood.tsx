import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ValueCue from '../../ValueCue';
import ProgressBar from '@/components/common/ProgressBar';
import NavigationButtons from '@/components/common/NavigationButtons';
import { saveAnswer } from '@/lib/saveAnswer';

const cueMap: Record<string, string> = {
  yes: "Your excitement is beautiful. ARIA will consider how parenting aligns with your next chapter. 💕",
  someday: "It’s okay to wait for the right time. Your journey is unfolding at your own pace. 🌱",
  unsure: "Being unsure is part of being intentional. We’ll support you no matter where you land. 🧘",
};

interface StepProps {
  onNext: () => void;
  onBack?: () => void;
  onSkip?: () => void;
}

export default function Step11Parenthood({ onNext, onBack, onSkip }: StepProps) {
  const [readiness, setReadiness] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('parenthoodReadiness') || '';
    if (saved) setReadiness(saved);
  }, []);

  const handleContinue = () => {
    setLoading(true);
    setTimeout(() => {
      if (readiness) {
        saveAnswer('parenthoodReadiness', readiness);
        saveAnswer('parenthoodCueUsed', cueMap[readiness]);
        saveAnswer('triggerNurturing', true);
      }
      setLoading(false);
      onNext();
    }, 500);
  };

  const handleSkip = () => {
    saveAnswer('parenthoodReadiness', 'skipped');
    saveAnswer('skipReason_parenthood', 'User skipped — potentially not ready or unsure.');
    saveAnswer('triggerNurturing', true);
    onSkip?.();
  };

  Step11Parenthood.handleNext = handleContinue;

  return (
    <div className="space-y-6">
      <ProgressBar step={11} totalSteps={24} />

      <label className="block text-xl font-bold text-pink-600">
        Do you feel ready for parenthood?
      </label>

      <select
        value={readiness}
        onChange={(e) => {
          setReadiness(e.target.value);
          localStorage.setItem('parenthoodReadiness', e.target.value);
        }}
        className="w-full border px-4 py-3 rounded-lg focus:outline-pink-500"
      >
        <option value="">Choose your level of readiness</option>
        <option value="yes">Yes — I’m excited to be a parent soon</option>
        <option value="someday">Someday, but not now</option>
        <option value="unsure">Not sure</option>
      </select>

      {readiness ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <ValueCue cue={cueMap[readiness]} />
        </motion.div>
      ) : (
        <p className="text-sm text-gray-500 italic">
          Optional — This won’t affect your account or visibility.
        </p>
      )}

      <NavigationButtons
        onBack={onBack}
        onNext={handleContinue}
        loading={loading}
        disabledNext={!readiness}
        nextLabel="Next Step"
      />

      {typeof onSkip === 'function' && (
        <div className="text-right">
          <button
            type="button"
            onClick={handleSkip}
            className="text-sm text-pink-500 underline hover:text-pink-600 mt-2"
          >
            Skip for now
          </button>
        </div>
      )}
    </div>
  );
}
