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
    id: 'disc5',
    text: 'I feel confident asserting my opinion, even in group settings.',
  },
  {
    id: 'disc6',
    text: 'I prioritize helping others feel heard and emotionally safe.',
  },
  {
    id: 'disc7',
    text: 'I enjoy creating rules, guidelines, and structure.',
  },
  {
    id: 'disc8',
    text: 'I enjoy entertaining others and making people laugh.',
  },
];

export default function DISCStep2() {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleSelect = (id: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handleNext = () => {
    localStorage.setItem('disc-step-2', JSON.stringify(answers));
    router.push('/dashboard/personality/disc/step-3');
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="text-2xl font-bold text-indigo-700 mb-6">DISC – Step 2 of 6</h1>
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
                      ? 'bg-green-500 text-white'
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
