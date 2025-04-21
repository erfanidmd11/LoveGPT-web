import React, { useState } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '@/layouts/DashboardLayout';

const questions = [
  {
    id: 'ennea_1',
    pair: [
      'I strive to be responsible, prepared, and do the right thing.',
      'I strive to be loved, admired, and seen as successful.',
    ],
  },
  {
    id: 'ennea_2',
    pair: [
      'I focus on helping others and making people feel safe and cared for.',
      'I am curious, introspective, and seek knowledge and inner truth.',
    ],
  },
];

export default function EnneaStep1() {
  const router = useRouter();
  const [selected, setSelected] = useState<Record<string, string>>({});

  const handleSelect = (qid: string, value: string) => {
    setSelected((prev) => ({ ...prev, [qid]: value }));
  };

  const handleNext = () => {
    localStorage.setItem('ennea-step-1', JSON.stringify(selected));
    router.push('/dashboard/personality/enneagram/step-2');
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto px-6 py-16">
        <h1 className="text-2xl font-bold text-indigo-700 mb-6">Enneagram Personality – Step 1 of 5</h1>
        <p className="text-sm text-gray-600 mb-6">Choose the statement from each pair that resonates more with your core motivation.</p>

        <div className="space-y-6">
          {questions.map(({ id, pair }) => (
            <div key={id} className="bg-white p-4 shadow rounded-xl">
              {pair.map((option) => (
                <button
                  key={option}
                  onClick={() => handleSelect(id, option)}
                  className={`block w-full text-left px-4 py-2 border rounded-lg text-sm mb-2 ${
                    selected[id] === option ? 'bg-indigo-600 text-white' : 'bg-gray-50 text-gray-800'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          ))}
        </div>

        <div className="mt-10 text-right">
          <button
            onClick={handleNext}
            disabled={Object.keys(selected).length !== questions.length}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg disabled:opacity-50"
          >
            Continue
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
