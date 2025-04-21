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
    id: 'q53',
    text: 'You enjoy solving practical problems more than discussing theoretical ideas.',
  },
  {
    id: 'q54',
    text: 'You tend to be highly aware of your surroundings and details others miss.',
  },
  {
    id: 'q55',
    text: 'You are more future-focused than present-minded in your thinking.',
  },
  {
    id: 'q56',
    text: 'You often seek harmony and avoid pushing your own opinions too strongly.',
  },
];

export default function MBTIStep14() {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleSelect = (id: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handleNext = () => {
    localStorage.setItem('mbti-step-14', JSON.stringify(answers));
    router.push('/dashboard/personality/mbti/step-15');
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="text-2xl font-bold text-indigo-700 mb-6">MBTI – Step 14 of 24</h1>
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
