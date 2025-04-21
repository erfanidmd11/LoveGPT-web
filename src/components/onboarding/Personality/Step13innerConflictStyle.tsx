import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ValueCue from '../../ValueCue';
import ProgressBar from '@/components/common/ProgressBar';
import { saveAnswer } from '@/lib/saveAnswer';
import { db, auth } from '@/lib/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

interface StepProps {
  onNext: () => void;
}

const toneMap: Record<string, string> = {
  "I avoid thinking about it until I’m forced to": "gentle",
  "I journal, meditate, or process privately": "reflective",
  "I need to talk it out with someone I trust": "empathetic",
  "I act quickly to remove the discomfort": "direct",
  "I seek logic and clarity over emotion": "analytical"
};

const Step13InnerConflictStyle: React.FC<StepProps> & { handleNext?: () => void } = ({ onNext }) => {
  const [selected, setSelected] = useState<string>('');

  useEffect(() => {
    const saved = localStorage.getItem('innerConflictStyle');
    if (saved) setSelected(saved);
  }, []);

  const handleSelect = async (value: string) => {
    setSelected(value);
    saveAnswer('innerConflictStyle', value);
    saveAnswer('aiToneStyle', toneMap[value]);
    localStorage.setItem('innerConflictStyle', value);

    try {
      await addDoc(collection(db, 'onboardingInsights'), {
        step: 'innerConflictStyle',
        userId: auth.currentUser?.uid || 'anon',
        answered: true,
        value,
        aiToneStyle: toneMap[value],
        timestamp: serverTimestamp(),
      });
    } catch (err) {
      console.error('🔥 Error saving onboarding insight:', err);
    }
  };

  const handleContinue = () => {
    if (!selected) return;
    onNext();
  };

  Step13InnerConflictStyle.handleNext = handleContinue;

  return (
    <div className="space-y-6 pb-32">
      <ProgressBar step={13} totalSteps={25} />

      <h2 className="text-2xl font-bold text-pink-600">
        When you're in conflict with yourself, how do you usually respond?
      </h2>

      <div className="grid gap-3">
        {Object.keys(toneMap).map((option) => (
          <button
            key={option}
            onClick={() => handleSelect(option)}
            className={`border px-4 py-2 rounded-xl transition ${
              selected === option
                ? 'bg-pink-100 border-pink-400 text-pink-800 font-semibold'
                : 'bg-white hover:border-pink-300'
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      {selected && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-6"
        >
          <ValueCue cue="Knowing how you manage internal conflict helps us match you with someone who supports—not triggers—your self-awareness style." />
        </motion.div>
      )}
    </div>
  );
};

export default Step13InnerConflictStyle;
