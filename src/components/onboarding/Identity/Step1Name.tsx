// src/components/onboarding/Identity/Step1Name.tsx
import React, { useEffect, useState } from 'react';
import ProgressBar from '@/components/common/ProgressBar';
import LoadingButton from '@/components/common/LoadingButton';
import { saveAnswer } from '@/lib/saveAnswer';

interface Step1NameProps {
  onNext: () => void;
  onBack?: () => void;
}

export default function Step1Name({ onNext }: Step1NameProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);

  const isValid = firstName.trim().length >= 2 && lastName.trim().length >= 2;

  useEffect(() => {
    const savedFirst = localStorage.getItem('firstName') || '';
    const savedLast = localStorage.getItem('lastName') || '';
    setFirstName(savedFirst);
    setLastName(savedLast);
  }, []);

  const handleSave = () => {
    if (!isValid) {
      alert('Please enter both your first and last name.');
      return;
    }

    setLoading(true);
    saveAnswer('firstName', firstName.trim());
    saveAnswer('lastName', lastName.trim());

    setTimeout(() => {
      setLoading(false);
      onNext();
    }, 300);
  };

  Step1Name.handleNext = handleSave;

  return (
    <div className="min-h-screen space-y-6 pb-32">
      <ProgressBar step={1} totalSteps={24} />

      <h2 className="text-2xl font-bold text-pink-600">What is your name?</h2>

      <input
        type="text"
        value={firstName}
        onChange={(e) => setFirstName(e.target.value)}
        placeholder="First Name"
        className="w-full border border-pink-200 rounded-xl px-4 py-3"
      />

      <input
        type="text"
        value={lastName}
        onChange={(e) => setLastName(e.target.value)}
        placeholder="Last Name"
        className="w-full border border-pink-200 rounded-xl px-4 py-3"
      />

      <LoadingButton
        onClick={handleSave}
        loading={loading}
        disabled={!isValid}
        label="Continue"
        className="mt-6"
      />
    </div>
  );
}
