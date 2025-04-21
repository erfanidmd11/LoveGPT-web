import React from 'react';

interface Segment {
  label: string;
  range: [number, number];
}

interface ProgressBarSegmentedProps {
  currentStep: number;
}

const segments: Segment[] = [
  { label: 'Profile', range: [0, 5] },
  { label: 'Values', range: [6, 12] },
  { label: 'Lifestyle', range: [13, 17] },
  { label: 'Compatibility', range: [18, 20] },
  { label: 'Intent & Future', range: [21, 24] }
];

const ProgressBarSegmented: React.FC<ProgressBarSegmentedProps> = ({ currentStep }) => {
  return (
    <div className="mb-6">
      <div className="flex justify-between mb-2 text-xs text-gray-600">
        {segments.map((seg, idx) => {
          const isActive = currentStep >= seg.range[0] && currentStep <= seg.range[1];
          return (
            <span
              key={idx}
              className={isActive ? 'font-bold text-pink-600' : ''}
            >
              {seg.label}
            </span>
          );
        })}
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className="bg-pink-500 h-2 rounded-full transition-all duration-500"
          style={{
            width: `${Math.min(((currentStep + 1) / 25) * 100, 100)}%`
          }}
        />
      </div>
    </div>
  );
};

export default ProgressBarSegmented;
