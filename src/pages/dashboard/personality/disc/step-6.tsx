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
    id: 'disc21',
    text: 'I appreciate rules and procedures that help things run smoothly.',
  },
  {
    id: 'disc22',
    text: 'I often take initiative and make quick decisions under pressure.',
  },
  {
    id: 'disc23',
    text: 'I enjoy being around people and easily strike up conversations.',
  },
  {
    id: 'disc24',
    text: 'I seek stability and tend to avoid unnecessary changes.',
  },
];

export function DISCStep6() {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleSelect = (id: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handleFinish = () => {
    localStorage.setItem('disc-step-6', JSON.stringify(answers));
    router.push('/dashboard/personality/disc/summary');
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-16">
      <h1 className="text-2xl font-bold text-indigo-700 mb-6">DISC – Final Step (6 of 6)</h1>
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
