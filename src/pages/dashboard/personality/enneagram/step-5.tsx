import React, { useState } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '@/layouts/DashboardLayout';

const questions = [
  {
    id: 'ennea_9',
    pair: [
      'I often take charge to protect others and keep things under control.',
      'I often avoid conflict and try to go with the flow to keep peace.',
    ],
  },
  {
    id: 'ennea_10',
    pair: [
      'I feel most alive when I’m learning and thinking about new ideas.',
      'I feel most alive when I’m helping someone feel loved or valued.',
    ],
  },
];

export default function EnneaStep5() {
  const router = useRouter();
  const [selected, setSelected] = useState<Record<string, string>>({});

  const handleSelect = (qid: string, value: string) => {
    setSelected((prev) => ({ ...prev, [qid]: value }));
  };

  const handleNext = () => {
    localStorage.setItem('ennea-step-5', JSON.stringify(selected));
    router.push('/dashboard/personality/enneagram/summary');
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto px-6 py-16">
        <h1 className="text-2xl font-bold text-indigo-700 mb-6">Enneagram Personality – Final Step (5 of 5)</h1>
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
            className="bg-green-600 text-white px-6 py-2 rounded-lg disabled:opacity-50"
          >
            Submit & View Summary
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
