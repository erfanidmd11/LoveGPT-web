// src/components/onboarding/Lifestyle/Step10AIConsent.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { saveAnswer } from '@/lib/saveAnswer';
import ProgressBar from '@/components/common/ProgressBar';

export default function Step10AIConsent({ onNext }) {
  const [consent, setConsent] = useState(false);

  useEffect(() => {
    const savedConsent = localStorage.getItem('aiConsent') === 'true';
    setConsent(savedConsent);
  }, []);

  const handleToggle = () => {
    const newConsent = !consent;
    setConsent(newConsent);
    localStorage.setItem('aiConsent', String(newConsent));
  };

  const handleContinue = () => {
    saveAnswer('aiConsent', consent);
    onNext(); // Handled by global navigation
  };

  Step10AIConsent.handleNext = handleContinue;

  return (
    <div className="space-y-6 pb-32">
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

      {consent && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-4 text-sm text-gray-600 bg-gray-50 border border-pink-100 rounded-lg p-3"
        >
          <strong className="text-pink-600">Why we ask this:</strong><br />
          ARIA can personalize your experience by understanding how you communicate. You’ll get more relevant matches and better insights — always ethically and with empathy. 💫
        </motion.div>
      )}

      <div className="mt-2 text-xs text-gray-500 italic">
        ARIA never shares your private information. Your answers are only used to help guide your matching and reflections. You can opt out anytime.
      </div>
    </div>
  );
}
