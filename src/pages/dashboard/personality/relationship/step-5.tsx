import React, { useState } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '@/layouts/DashboardLayout';

const questions = [
  {
    id: 'relationship_9',
    text: 'How do you feel about vulnerability in romantic relationships?',
    options: [
      'I embrace vulnerability — it builds intimacy and trust',
      'I’m cautious — I want to share but it takes me time',
      'I fear being vulnerable and tend to keep my guard up',
    ],
  },
  {
    id: 'relationship_10',
    text: 'What do you most desire in your next relationship?',
    options: [
      'Deep connection, aligned values, and emotional safety',
      'Companionship, laughter, and fun shared experiences',
      'Passion, excitement, and strong physical chemistry',
    ],
  },
];

export default function RelationshipStep5() {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleSelect = (qid: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [qid]: value }));
  };

  const handleNext = () => {
    localStorage.setItem('relationship-step-5', JSON.stringify(answers));
    router.push('/dashboard/personality/relationship/summary');
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto px-6 py-16">
        <h1 className="text-2xl font-bold text-indigo-700 mb-6">Relationship Readiness – Final Step (5 of 5)</h1>
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
            className="bg-green-600 text-white px-6 py-2 rounded-lg disabled:opacity-50"
          >
            Submit & View Summary
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}
