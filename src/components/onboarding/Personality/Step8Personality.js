// src/components/onboarding/Personality/Step8Personality.js
import React, { useState } from 'react';
import ValueCue from '../../ValueCue';
import ProgressBar from '@/components/common/ProgressBar';
import NavigationButtons from '@/components/common/NavigationButtons';
import { saveAnswer } from '@/lib/saveAnswer';

export default function Step8Personality({ onNext, onBack }) {
  const [answers, setAnswers] = useState({
    mbtiThinkingFeeling: localStorage.getItem('mbtiThinkingFeeling') || '',
    mbtiExtrovertIntrovert: localStorage.getItem('mbtiExtrovertIntrovert') || '',
    bfiPlanningPreference: localStorage.getItem('bfiPlanningPreference') || '',
    nlpOpenness: localStorage.getItem('nlpOpenness') || '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (key, value) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
    setError('');
  };

  const handleContinue = () => {
    const allAnswered = Object.values(answers).every(Boolean);
    if (!allAnswered) return setError('Please answer all questions to continue.');

    setLoading(true);
    setTimeout(() => {
      Object.entries(answers).forEach(([key, value]) => {
        saveAnswer(key, value);
      });
      setLoading(false);
      onNext();
    }, 500);
  };

  return (
    <div className="space-y-6">
      <ProgressBar step={8} totalSteps={24} />

      <h2 className="text-2xl font-bold text-pink-600">Let’s uncover some truths 🌱</h2>
      <p className="text-gray-600">
        These questions help ARIA understand your inner world. No pressure — just answer honestly.
      </p>

      <div className="space-y-4">
        <div>
          <label className="block font-medium mb-1">
            I make decisions based on logic more than emotions.
          </label>
          <select
            value={answers.mbtiThinkingFeeling}
            onChange={(e) => handleChange('mbtiThinkingFeeling', e.target.value)}
            className="w-full border px-4 py-2 rounded"
          >
            <option value="">Choose one</option>
            <option value="agree">Agree</option>
            <option value="somewhat">Somewhat</option>
            <option value="disagree">Disagree</option>
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">
            I get energy from being around people.
          </label>
          <select
            value={answers.mbtiExtrovertIntrovert}
            onChange={(e) => handleChange('mbtiExtrovertIntrovert', e.target.value)}
            className="w-full border px-4 py-2 rounded"
          >
            <option value="">Choose one</option>
            <option value="extrovert">Agree</option>
            <option value="neutral">Sometimes</option>
            <option value="introvert">Disagree</option>
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">
            I like to plan things far in advance.
          </label>
          <select
            value={answers.bfiPlanningPreference}
            onChange={(e) => handleChange('bfiPlanningPreference', e.target.value)}
            className="w-full border px-4 py-2 rounded"
          >
            <option value="">Choose one</option>
            <option value="true">True</option>
            <option value="neutral">Sometimes</option>
            <option value="false">False</option>
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">
            People say I'm adaptable and open to change.
          </label>
          <select
            value={answers.nlpOpenness}
            onChange={(e) => handleChange('nlpOpenness', e.target.value)}
            className="w-full border px-4 py-2 rounded"
          >
            <option value="">Choose one</option>
            <option value="agree">Agree</option>
            <option value="somewhat">Somewhat</option>
            <option value="disagree">Disagree</option>
          </select>
        </div>
      </div>

      <ValueCue cue="These are early clues to your compatibility blueprint. ARIA uses this to help you connect more deeply." />

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

      <NavigationButtons
        onBack={onBack}
        onNext={handleContinue}
        loading={loading}
        disabledNext={Object.values(answers).some((val) => !val)}
        nextLabel="Continue →"
      />
    </div>
  );
}
