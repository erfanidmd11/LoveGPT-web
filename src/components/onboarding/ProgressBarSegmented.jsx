// src/components/onboarding/ProgressBarSegmented.jsx
import React from 'react';

const segments = [
  { label: "Profile", range: [0, 5] },
  { label: "Values", range: [6, 12] },
  { label: "Lifestyle", range: [13, 17] },
  { label: "Compatibility", range: [18, 20] },
  { label: "Intent & Future", range: [21, 24] }
];

export default function ProgressBarSegmented({ currentStep }) {
  return (
    <div className="mb-6">
      <div className="flex justify-between mb-2 text-xs text-gray-600">
        {segments.map((seg, idx) => (
          <span
            key={idx}
            className={`${
              currentStep >= seg.range[0] && currentStep <= seg.range[1]
                ? 'font-bold text-pink-600'
                : ''
            }`}
          >
            {seg.label}
          </span>
        ))}
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-pink-500 h-2 rounded-full transition-all duration-500"
          style={{
            width: `${((currentStep + 1) / 24) * 100}%`
          }}
        />
      </div>
    </div>
  );
}
