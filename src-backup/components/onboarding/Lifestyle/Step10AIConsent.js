// src/components/onboarding/Lifestyle/Step10AIConsent.js
import React, { useState } from 'react';
import { saveAnswer } from '@/lib/saveAnswer';
import ProgressBar from '@/components/common/ProgressBar';
import NavigationButtons from '@/components/common/NavigationButtons';

export default function Step10AIConsent({ onNext, onBack }) {
  const [consent, setConsent] = useState(
    localStorage.getItem('aiConsent') === 'true'
  );
  const [loading, setLoading] = useState(false);

  const handleToggle = () => {
    setConsent((prev) => !prev);
  };

  const handleContinue = () => {
    setLoading(true);
    setTimeout(() => {
      saveAnswer('aiConsent', consent);
      setLoading(false);
      onNext();
    }, 500);
  };

  return (
    <div className="space-y-6">
      <ProgressBar step={10} totalSteps={24} />

      <h2 className="text-xl font-bold text-pink-600">Do you consent to AI feedback?</h2>
      <p className="text-sm text-gray-600">
        Our AI may analyze your answers and communication patterns to help guide your dating journey. You’re always in control.
      </p>

      <label className="inline-flex items-center space-x-3 mt-2">
        <input
          type="checkbox"
          checked={consent}
          onChange={handleToggle}
          className="accent-pink-500"
        />
        <span>I consent to AI analysis of my communication for better matches.</span>
      </label>

      <div className="mt-4 text-sm text-gray-600 bg-gray-50 border border-pink-100 rounded-lg p-3">
        <strong className="text-pink-600">Why we ask this:</strong><br />
        ARIA can personalize your experience by understanding how you communicate. You’ll get more relevant matches and better insights — always ethically and with empathy. 💫
      </div>

      <div className="mt-2 text-xs text-gray-500 italic">
        ARIA never shares your private information. Your answers are only used to help guide your matching and reflections. You can opt-out anytime.
      </div>

      <NavigationButtons
        onBack={onBack}
        onNext={handleContinue}
        loading={loading}
        disabledNext={false}
        nextLabel="Continue →"
      />
    </div>
  );
}
