// src/components/onboarding/common/NavigationButtons.jsx
import React from 'react';

export default function NavigationButtons({
  onBack,
  onNext,
  loading = false,
  disabledNext = false,
  nextLabel = 'Next',
}) {
  return (
    <div className="mt-6 flex justify-between items-center">
      <button
        onClick={onBack}
        className="bg-gray-200 text-gray-700 px-6 py-2 rounded-xl hover:bg-gray-300"
      >
        Back
      </button>

      <button
        onClick={onNext}
        disabled={disabledNext || loading}
        className="bg-pink-500 text-white px-6 py-2 rounded-xl hover:bg-pink-600 disabled:opacity-50"
      >
        {loading ? 'Loading...' : nextLabel}
      </button>
    </div>
  );
}
