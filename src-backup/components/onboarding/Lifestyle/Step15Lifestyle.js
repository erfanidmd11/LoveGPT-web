// src/components/onboarding/Lifestyle/Step15Lifestyle.js
import React, { useState } from 'react';
import ValueCue from '../../ValueCue';
import ProgressBar from '@/components/common/ProgressBar';
import NavigationButtons from '@/components/common/NavigationButtons';
import { saveAnswer } from '@/lib/saveAnswer';

const currentLifestyles = [
  "🧘‍♀️ Calm & Simple – I enjoy peace, stability, and minimalism",
  "🌆 Urban & Active – I love the buzz, social events, dining out",
  "✈️ Jetsetter – I travel often, love experiences over things",
  "📈 High-Achiever – I work hard, play hard, aim big",
];

const aspirationLevels = [
  "Maintain my current lifestyle",
  "Level up my lifestyle",
  "I'm open to growing with someone",
  "I'm flexible – love matters more than money",
];

export default function Step15Lifestyle({ onNext, onBack }) {
  const [current, setCurrent] = useState(localStorage.getItem('lifestyleNow') || '');
  const [aspire, setAspire] = useState(localStorage.getItem('lifestyleAspire') || '');
  const [loading, setLoading] = useState(false);

  const isReady = current && aspire;

  const handleContinue = () => {
    setLoading(true);
    setTimeout(() => {
      saveAnswer('lifestyleNow', current);
      saveAnswer('lifestyleAspire', aspire);
      setLoading(false);
      onNext();
    }, 500);
  };

  return (
    <div className="space-y-6">
      <ProgressBar step={15} totalSteps={24} />

      <h2 className="text-2xl font-bold text-gray-800">
        Let’s talk lifestyle 💼 ✨
      </h2>

      <ValueCue cue="Knowing your lifestyle helps us prevent mismatches in comfort, pace, and expectations." />

      <div>
        <p className="text-sm font-semibold text-gray-600 mb-2">What’s your current lifestyle like?</p>
        <div className="space-y-2">
          {currentLifestyles.map((option, idx) => (
            <button
              key={idx}
              className={`w-full text-left px-4 py-2 border rounded-xl transition ${
                current === option ? 'bg-blue-100 border-blue-400' : 'bg-white border-gray-300 hover:border-pink-300'
              }`}
              onClick={() => setCurrent(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-semibold text-gray-600 mt-4 mb-2">What do you expect or hope for?</p>
        <div className="space-y-2">
          {aspirationLevels.map((option, idx) => (
            <button
              key={idx}
              className={`w-full text-left px-4 py-2 border rounded-xl transition ${
                aspire === option ? 'bg-pink-100 border-pink-400' : 'bg-white border-gray-300 hover:border-pink-300'
              }`}
              onClick={() => setAspire(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <NavigationButtons
        onBack={onBack}
        onNext={handleContinue}
        loading={loading}
        disabledNext={!isReady}
        nextLabel="Continue →"
      />
    </div>
  );
}
