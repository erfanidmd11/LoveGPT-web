import React, { useState } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '@/layouts/DashboardLayout';

const questions = [
  {
    id: 'big5_25',
    text: 'I tend to be reserved in unfamiliar social situations.',
  },
  {
    id: 'big5_26',
    text: 'I enjoy helping others solve emotional or relationship problems.',
  },
  {
    id: 'big5_27',
    text: 'I rarely procrastinate and often finish tasks ahead of schedule.',
  },
  {
    id: 'big5_28',
    text: 'I often replay conversations or mistakes in my head.',
  },
];

export default function Big5Step7() {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleSelect = (id: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handleNext = () => {
    localStorage.setItem('big5-step-7', JSON.stringify(answers));
    router.push('/dashboard/personality/big5/step-8');
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto px-6 py-16">
        <h1 className="text-2xl font-bold text-indigo-700 mb-6">Big 5 – Step 7 of 10</h1>
        <div className="space-y-6">
          {questions.map((q) => (
            <div key={q.id} className="bg-white p-4 shadow rounded-xl">
              <p className="text-gray-800 font-medium mb-2">{q.text}</p>
              <div className="flex gap-4 flex-wrap">
                {['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'].map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleSelect(q.id, opt)}
                    className={`px-3 py-2 rounded text-sm border ${
                      answers[q.id] === opt
                        ? 'bg-indigo-500 text-white'
                        : 'bg-gray-50 text-gray-700'
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-right">
          <button
            onClick={handleNext}
            disabled={Object.keys(answers).length !== questions.length}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg disabled:opacity-50"
          >
            Continue
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
