import React, { useState } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '@/layouts/DashboardLayout';

const questions = [
  {
    id: 'relationship_5',
    text: 'When it comes to conflict resolution, what describes you best?',
    options: [
      'I seek to understand and compromise when possible',
      'I tend to become defensive or withdrawn under pressure',
      'I usually stand my ground and push to be heard first',
    ],
  },
  {
    id: 'relationship_6',
    text: 'What’s your current relationship history like?',
    options: [
      'I’ve had meaningful long-term relationships in the past',
      'I’ve had mostly short-term or situationships',
      'I’ve never been in a serious relationship',
    ],
  },
];

export default function RelationshipStep3() {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleSelect = (qid: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [qid]: value }));
  };

  const handleNext = () => {
    localStorage.setItem('relationship-step-3', JSON.stringify(answers));
    router.push('/dashboard/personality/relationship/step-4');
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto px-6 py-16">
        <h1 className="text-2xl font-bold text-indigo-700 mb-6">Relationship Readiness – Step 3 of 5</h1>
        <div className="space-y-6">
          {questions.map((q) => (
            <div key={q.id} className="bg-white p-4 shadow rounded-xl">
              <p className="text-gray-800 font-medium mb-3">{q.text}</p>
              <div className="space-y-2">
                {q.options.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => handleSelect(q.id, opt)}
                    className={`w-full text-left px-4 py-2 rounded-lg border text-sm ${
                      answers[q.id] === opt ? 'bg-indigo-600 text-white' : 'bg-gray-50 text-gray-700'
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
