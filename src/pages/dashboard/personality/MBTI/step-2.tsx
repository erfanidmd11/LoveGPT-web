import React, { useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import DashboardLayout from '@/layouts/DashboardLayout'; // ✅ Add this last

export default function ResumePage() {
  return (
    <DashboardLayout>
  <div className="p-6 text-center text-gray-500">Page Coming Soon</div>
</DashboardLayout>
  );
}

const questions = [
  {
    id: 'q5',
    text: 'You feel comfortable just walking up to someone you find interesting and striking up a conversation.',
  },
  {
    id: 'q6',
    text: 'You often prefer to stay home rather than go out to socialize.',
  },
  {
    id: 'q7',
    text: 'You enjoy being the center of attention.',
  },
  {
    id: 'q8',
    text: 'You find it draining to be around people for too long.',
  },
];

export function MBTIStep2() {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleSelect = (id: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handleNext = () => {
    localStorage.setItem('mbti-step-2', JSON.stringify(answers));
    router.push('/dashboard/personality/mbti/step-3');
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="text-2xl font-bold text-indigo-700 mb-6">MBTI – Step 2 of 24</h1>
      <div className="space-y-6">
        {questions.map((q) => (
          <div key={q.id} className="bg-white p-4 shadow rounded-xl">
            <p className="text-gray-800 font-medium mb-2">{q.text}</p>
            <div className="flex gap-4">
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
          onClick={handleNext}
          disabled={Object.keys(answers).length !== questions.length}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg disabled:opacity-50"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
