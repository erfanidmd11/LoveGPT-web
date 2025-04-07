import React, { useEffect, useState } from 'react';
import { calculateMatchReadiness } from '@/lib/matchReadiness';
import { getAllAnswers } from '@/lib/getAllOnboardingAnswers'; // optional helper
import { Progress } from '@radix-ui/react-progress'; // or your preferred progress component

export default function MatchReadinessWidget() {
  const [readiness, setReadiness] = useState(null);

  useEffect(() => {
    const data = getAllAnswers(); // or pull from Firestore/user context
    const result = calculateMatchReadiness(data);
    setReadiness(result);
  }, []);

  if (!readiness) return null;

  return (
    <div className="p-5 bg-white border rounded-xl shadow-md space-y-4">
      <h3 className="text-lg font-bold text-pink-600">💡 Match Readiness Score</h3>

      <div className="flex items-center gap-4">
        <div className="relative w-24 h-24 flex items-center justify-center rounded-full bg-pink-100">
          <span className="text-2xl font-extrabold text-pink-600">
            {readiness.score}
          </span>
        </div>
        <div>
          <p className="text-md font-semibold text-gray-700">
            {readiness.category}
          </p>
          <Progress
            value={readiness.score}
            max={100}
            className="mt-1 h-2 rounded bg-gray-200"
          >
            <div
              style={{ width: `${readiness.score}%` }}
              className="h-full bg-pink-500 rounded transition-all duration-300"
            />
          </Progress>
        </div>
      </div>

      <div className="text-sm text-gray-600 italic">{readiness.insights[0]}</div>

      <button
        onClick={() => (window.location.href = '/onboarding/edit')}
        className="mt-3 text-sm text-pink-600 hover:underline"
      >
        🔄 Reflect & Improve
      </button>
    </div>
  );
}
