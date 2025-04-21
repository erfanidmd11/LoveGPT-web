import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import DashboardLayout from '@/layouts/DashboardLayout'; // ✅ Add this last

export default function ResumePage() {
  return (
    <DashboardLayout>
      {/* Your page JSX here */}
    </DashboardLayout>
  );
}

const questions = [
  {
    id: 'q93',
    text: 'You are comfortable being spontaneous and adjusting plans last minute.',
  },
  {
    id: 'q94',
    text: 'You tend to notice and remember small details about people and environments.',
  },
  {
    id: 'q95',
    text: 'You often seek meaning and purpose in your life decisions.',
  },
  {
    id: 'q96',
    text: 'You are known for staying calm and focused under pressure.',
  },
];

export default function MBTIStep24() {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleSelect = (id: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handleFinish = () => {
    localStorage.setItem('mbti-step-24', JSON.stringify(answers));
    router.push('/dashboard/personality/mbti/complete');
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="text-2xl font-bold text-indigo-700 mb-6">MBTI – Final Step (24 of 24)</h1>
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
                      ? 'bg-pink-500 text-white'
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
  );
}
