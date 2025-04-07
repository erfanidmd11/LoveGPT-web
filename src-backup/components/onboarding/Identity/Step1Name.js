import React, { useState } from 'react';
import { saveAnswer } from '@/lib/saveAnswer';
import ProgressBar from '@/components/common/ProgressBar';
import NavigationButtons from '@/components/common/NavigationButtons';

export default function Step1Name({ onNext, onBack }) {
  const [firstName, setFirstName] = useState(localStorage.getItem('firstName') || '');
  const [lastName, setLastName] = useState(localStorage.getItem('lastName') || '');
  const [loading, setLoading] = useState(false);

  const isValid = firstName.trim().length >= 2 && lastName.trim().length >= 2;

  const handleContinue = () => {
    if (!isValid) {
      alert("Please enter your full name.");
      return;
    }

    setLoading(true);
    saveAnswer('firstName', firstName);
    saveAnswer('lastName', lastName);

    setTimeout(() => {
      setLoading(false);
      onNext();
    }, 500);
  };

  return (
    <div className="space-y-6">
      <ProgressBar step={1} totalSteps={24} />

      <h2 className="text-2xl font-bold text-pink-600">What is your name?</h2>

      <input
        type="text"
        placeholder="First Name"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        className="w-full border border-pink-200 rounded-xl px-4 py-3"
      />
      <input
        type="text"
        placeholder="Last Name"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        className="w-full border border-pink-200 rounded-xl px-4 py-3"
      />

      <NavigationButtons
        onBack={onBack}
        onNext={handleContinue}
        loading={loading}
        disabledNext={!isValid}
        nextLabel="Continue →"
      />
    </div>
  );
}
