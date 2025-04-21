import React, { useState } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '@/layouts/DashboardLayout';

const questions = [
  {
    id: 'big5_37',
    text: 'I prefer a calm, peaceful environment over a busy or stimulating one.',
  },
  {
    id: 'big5_38',
    text: 'I tend to think about the future more than dwell on the past.',
  },
  {
    id: 'big5_39',
    text: 'I am confident in my decision-making even in uncertain situations.',
  },
  {
    id: 'big5_40',
    text: 'I get nervous easily in high-pressure situations.',
  },
];

export default function Big5Step10() {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleSelect = (id: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handleFinish = () => {
    localStorage.setItem('big5-step-10', JSON.stringify(answers));
    router.push('/dashboard/personality/big5/summary');
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto px-6 py-16">
        <h1 className="text-2xl font-bold text-indigo-700 mb-6">Big 5 – Final Step (10 of 10)</h1>
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
            onClick={handleFinish}
            disabled={Object.keys(answers).length !== questions.length}
            className="bg-green-600 text-white px-6 py-2 rounded-lg disabled:opacity-50"
          >
            Submit & View Results
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
