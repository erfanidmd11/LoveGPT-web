// src/components/onboarding/Relationship/Step9RelationshipStatus.js
import React, { useState } from 'react';
import ValueCue from '../../ValueCue';
import ProgressBar from '@/components/common/ProgressBar';
import NavigationButtons from '@/components/common/NavigationButtons';
import { saveAnswer } from '@/lib/saveAnswer';

const statusOptions = [
  { value: 'single', label: 'Single' },
  { value: 'divorced', label: 'Divorced' },
  { value: 'widowed', label: 'Widowed' },
  { value: 'inRelationship', label: 'In a Relationship' },
];

const cueMap = {
  single: "We'll match you with someone who's ready for love and alignment.",
  divorced: "We honor your past and help you rewrite your love story. 💫",
  widowed: "We'll gently prioritize empathy and emotional availability in your matches. 💛",
  inRelationship: "Even if you're exploring, ARIA will guide with integrity and intention.",
};

const strategyMap = {
  single: 'standard',
  divorced: 'resilience_match',
  widowed: 'empathy_match',
  inRelationship: 'awareness_only',
};

export default function Step9RelationshipStatus({ onNext, onBack }) {
  const [status, setStatus] = useState(localStorage.getItem('relationshipStatus') || '');
  const [loading, setLoading] = useState(false);

  const handleContinue = () => {
    if (!status) return;

    setLoading(true);
    setTimeout(() => {
      saveAnswer('relationshipStatus', status);
      saveAnswer('matchStrategy', strategyMap[status]);
      setLoading(false);
      onNext();
    }, 500);
  };

  return (
    <div className="space-y-6">
      <ProgressBar step={9} totalSteps={24} />

      <label className="block text-xl font-bold text-pink-600">
        What is your current relationship status?
      </label>

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
        className="w-full border px-4 py-3 rounded-lg focus:outline-pink-500"
        required
      >
        <option value="">Select...</option>
        {statusOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>

      {status && <ValueCue cue={cueMap[status]} />}

      <NavigationButtons
        onBack={onBack}
        onNext={handleContinue}
        loading={loading}
        disabledNext={!status}
        nextLabel="Continue →"
      />
    </div>
  );
}
