// src/components/onboarding/Personality/Step13InnerConflictStyle.js
import React, { useState } from 'react';
import ValueCue from '../../ValueCue';
import ProgressBar from '@/components/common/ProgressBar';
import NavigationButtons from '@/components/common/NavigationButtons';
import { saveAnswer } from '@/lib/saveAnswer';
import { db, auth } from '@/lib/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';

const toneMap = {
  "I avoid thinking about it until I’m forced to": "gentle",
  "I journal, meditate, or process privately": "reflective",
  "I need to talk it out with someone I trust": "empathetic",
  "I act quickly to remove the discomfort": "direct",
  "I seek logic and clarity over emotion": "analytical"
};

export default function Step13InnerConflictStyle({ onNext, onBack }) {
  const [selected, setSelected] = useState(localStorage.getItem('innerConflictStyle') || '');
  const [loading, setLoading] = useState(false);

  const handleSelect = async (value) => {
    setSelected(value);
    saveAnswer('innerConflictStyle', value);
    saveAnswer('aiToneStyle', toneMap[value]);

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
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onNext();
    }, 500);
  };

  return (
    <div className="space-y-6">
      <ProgressBar step={13} totalSteps={24} />

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
                : 'hover:border-pink-300'
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      <ValueCue cue="Knowing how you manage internal conflict helps us match you with someone who supports—not triggers—your self-awareness style." />

      <NavigationButtons
        onBack={onBack}
        onNext={handleContinue}
        loading={loading}
        disabledNext={!selected}
        nextLabel="Next"
      />
    </div>
  );
}
