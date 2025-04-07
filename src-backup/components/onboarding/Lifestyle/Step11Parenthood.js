// src/components/onboarding/Lifestyle/Step11Parenthood.js
import React, { useState } from 'react';
import { saveAnswer } from '@/lib/saveAnswer';
import ProgressBar from '@/components/common/ProgressBar';
import ValueCue from '../../ValueCue';
import NavigationButtons from '@/components/common/NavigationButtons';

const cueMap = {
  yes: "Your excitement is beautiful. ARIA will consider how parenting aligns with your next chapter. 💕",
  someday: "It’s okay to wait for the right time. Your journey is unfolding at your own pace. 🌱",
  unsure: "Being unsure is part of being intentional. We’ll support you no matter where you land. 🧘",
};

export default function Step11Parenthood({ onNext, onSkip, onBack }) {
  const [readiness, setReadiness] = useState(localStorage.getItem('parenthoodReadiness') || '');
  const [loading, setLoading] = useState(false);

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
    onSkip();
  };

  return (
    <div className="space-y-6">
      <ProgressBar step={11} totalSteps={24} />

      <label className="block text-xl font-bold text-pink-600">
        Do you feel ready for parenthood?
      </label>

      <select
        value={readiness}
        onChange={(e) => setReadiness(e.target.value)}
        className="w-full border px-4 py-3 rounded-lg focus:outline-pink-500"
      >
        <option value="">Choose your level of readiness</option>
        <option value="yes">Yes — I’m excited to be a parent soon</option>
        <option value="someday">Someday, but not now</option>
        <option value="unsure">Not sure</option>
      </select>

      {readiness ? (
        <ValueCue cue={cueMap[readiness]} />
      ) : (
        <p className="text-sm text-gray-500 italic">
          Optional — This won’t affect your account or visibility.
        </p>
      )}

      <NavigationButtons
        onBack={onBack}
        onNext={handleContinue}
        loading={loading}
        disabledNext={false}
        nextLabel="Continue"
      />

      <div className="mt-2 text-right">
        <button
          type="button"
          onClick={handleSkip}
          className="text-sm text-pink-500 underline hover:text-pink-600"
        >
          Skip for now
        </button>
      </div>
    </div>
  );
}
