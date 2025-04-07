// src/components/onboarding/connection/Step23ConditioningBeliefs.js
import React, { useState } from 'react';
import ValueCue from '../../ValueCue';
import ProgressBar from '@/components/common/ProgressBar';
import NavigationButtons from '@/components/common/NavigationButtons';
import { saveAnswer } from '@/lib/saveAnswer';

export default function Step23ConditioningBeliefs({ onNext, onBack }) {
  const [beliefs, setBeliefs] = useState(localStorage.getItem('conditionedBeliefs') || '');
  const [releaseReady, setReleaseReady] = useState(
    localStorage.getItem('readyToReleaseBeliefs') === 'true'
  );
  const [loading, setLoading] = useState(false);

  const handleContinue = () => {
    if (beliefs.trim().length < 10) {
      alert("Please share a bit more about what you were conditioned to believe ❤️‍🩹");
      return;
    }

    setLoading(true);
    saveAnswer('conditionedBeliefs', beliefs);
    saveAnswer('readyToReleaseBeliefs', releaseReady.toString());

    setTimeout(() => {
      setLoading(false);
      onNext();
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <ProgressBar step={23} totalSteps={24} />

      <h2 className="text-2xl font-bold text-pink-600">
        What beliefs have you been conditioned to hold about love or yourself?
      </h2>

      <textarea
        value={beliefs}
        onChange={(e) => setBeliefs(e.target.value)}
        placeholder="Examples: 'Love has to be earned', 'I'm not worthy of being chosen', 'Men always leave'..."
        className="w-full border border-pink-200 rounded-xl px-4 py-3 min-h-[120px] focus:outline-pink-500"
      />

      <label className="flex items-center space-x-3 text-sm text-gray-700">
        <input
          type="checkbox"
          checked={releaseReady}
          onChange={(e) => setReleaseReady(e.target.checked)}
          className="accent-pink-500"
        />
        <span>I'm ready to release these beliefs and rewire how I love.</span>
      </label>

      <ValueCue cue="These hidden programs shape how you attach, react, and choose. Awareness is the beginning of emotional mastery. ARIA will help you evolve." />

      <NavigationButtons
        onBack={onBack}
        onNext={handleContinue}
        loading={loading}
        disabledNext={beliefs.trim().length < 10}
        nextLabel="Continue →"
      />
    </div>
  );
}
