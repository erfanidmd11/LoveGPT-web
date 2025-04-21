import React, { useState } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '@/layouts/DashboardLayout';

const questions = [
  {
    id: 'big5_33',
    text: 'I enjoy exploring abstract ideas and philosophical questions.',
  },
  {
    id: 'big5_34',
    text: 'I find joy in giving more than receiving.',
  },
  {
    id: 'big5_35',
    text: 'I’m consistent and dependable in my responsibilities.',
  },
  {
    id: 'big5_36',
    text: 'I often feel tense or high-strung.',
  },
];

export default function Big5Step9() {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleSelect = (id: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handleNext = () => {
    localStorage.setItem('big5-step-9', JSON.stringify(answers));
    router.push('/dashboard/personality/big5/step-10');
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto px-6 py-16">
        <h1 className="text-2xl font-bold text-indigo-700 mb-6">Big 5 – Step 9 of 10</h1>
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
