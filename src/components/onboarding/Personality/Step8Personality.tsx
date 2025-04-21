import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ValueCue from '../../ValueCue';
import ProgressBar from '@/components/common/ProgressBar';
import { saveAnswer } from '@/lib/saveAnswer';

interface StepProps {
  onNext: () => void;
}

interface PersonalityAnswers {
  mbtiThinkingFeeling: string;
  mbtiExtrovertIntrovert: string;
  bfiPlanningPreference: string;
  nlpOpenness: string;
}

const Step8Personality: React.FC<StepProps> & { handleNext?: () => void } = ({ onNext }) => {
  const [answers, setAnswers] = useState<PersonalityAnswers>({
    mbtiThinkingFeeling: '',
    mbtiExtrovertIntrovert: '',
    bfiPlanningPreference: '',
    nlpOpenness: '',
  });

  const [error, setError] = useState<string>('');

  useEffect(() => {
    setAnswers({
      mbtiThinkingFeeling: localStorage.getItem('mbtiThinkingFeeling') || '',
      mbtiExtrovertIntrovert: localStorage.getItem('mbtiExtrovertIntrovert') || '',
      bfiPlanningPreference: localStorage.getItem('bfiPlanningPreference') || '',
      nlpOpenness: localStorage.getItem('nlpOpenness') || '',
    });
  }, []);

  const handleChange = (key: keyof PersonalityAnswers, value: string) => {
    const updated = { ...answers, [key]: value };
    setAnswers(updated);
    localStorage.setItem(key, value);
    saveAnswer(key, value);
    setError('');
  };

  const handleContinue = () => {
    const allFilled = Object.values(answers).every(Boolean);
    if (!allFilled) {
      setError('Please answer all questions to continue.');
      return;
    }
    onNext();
  };

  Step8Personality.handleNext = handleContinue;

  return (
    <div className="space-y-6 pb-32">
      <ProgressBar step={8} totalSteps={25} />

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
            className="w-full border px-4 py-2 rounded-xl focus:outline-pink-500"
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
            className="w-full border px-4 py-2 rounded-xl focus:outline-pink-500"
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
            className="w-full border px-4 py-2 rounded-xl focus:outline-pink-500"
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
            className="w-full border px-4 py-2 rounded-xl focus:outline-pink-500"
          >
            <option value="">Choose one</option>
            <option value="agree">Agree</option>
            <option value="somewhat">Somewhat</option>
            <option value="disagree">Disagree</option>
          </select>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mt-6"
      >
        <ValueCue cue="These are early clues to your compatibility blueprint. ARIA uses this to help you connect more deeply." />
      </motion.div>

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
    </div>
  );
};

export default Step8Personality;
