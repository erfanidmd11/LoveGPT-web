// src/components/onboarding/ProgressBar.tsx
import React from 'react';

interface Section {
  label: string;
  start: number;
  end: number;
  emoji: string;
}

const sections: Section[] = [
  { label: 'Identity', start: 1, end: 5, emoji: '🪞' },
  { label: 'Values', start: 6, end: 10, emoji: '💖' },
  { label: 'Personality', start: 11, end: 16, emoji: '🧠' },
  { label: 'Lifestyle', start: 17, end: 21, emoji: '🧬' },
  { label: 'Relationship Intent', start: 22, end: 24, emoji: '🎯' }
];

const getCurrentSection = (step: number): Section | undefined => {
  return sections.find((section) => step >= section.start && step <= section.end);
};

interface ProgressBarProps {
  step: number;
  totalSteps: number;
}

export default function ProgressBar({ step, totalSteps }: ProgressBarProps) {
  const percent = Math.round((step / totalSteps) * 100);
  const section = getCurrentSection(step);

  return (
    <div className="w-full mb-6">
      {/* Label + Emoji */}
      {section && (
        <div className="flex items-center justify-center text-sm text-gray-600 mb-1">
          <span className="mr-1">{section.emoji}</span>
          <span>
            You’re in the <span className="font-medium">{section.label}</span> section
          </span>
        </div>
      )}

      {/* Main Bar */}
      <div className="relative w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
        <div
          className="absolute top-0 left-0 h-full rounded-full bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-500 ease-in-out"
          style={{ width: `${percent}%` }}
        />

        {/* Milestone Markers */}
        {sections.map((s, i) => {
          const position = ((s.start - 1) / totalSteps) * 100;
          return (
            <div
              key={i}
              className="absolute top-0 -translate-x-1/2 text-xs"
              style={{ left: `${position}%` }}
              title={`${s.label} section`}
            >
              <span role="img" aria-label={s.label}>
                {s.emoji}
              </span>
            </div>
          );
        })}
      </div>

      {/* % Complete */}
      <div className="flex justify-between text-xs text-gray-500 mt-2">
        <span>Step {step} of {totalSteps}</span>
        <span>{percent}% Complete</span>
      </div>
    </div>
  );
}
