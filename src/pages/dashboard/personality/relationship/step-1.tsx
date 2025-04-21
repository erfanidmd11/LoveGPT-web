import React, { useState } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '@/layouts/DashboardLayout';

const questions = [
  {
    id: 'relationship_1',
    text: 'How emotionally available do you feel for a committed relationship right now?',
    options: [
      'Very ready – I’ve done a lot of self-work and I’m open to love',
      'Somewhat – I want connection but still healing or evolving',
      'Not quite – I have emotional blocks or past wounds I’m navigating',
    ],
  },
  {
    id: 'relationship_2',
    text: 'What is your current intention when it comes to dating?',
    options: [
      'Looking for long-term partnership or marriage',
      'Open to meaningful connection but taking it slow',
      'Exploring or unsure — just meeting people right now',
    ],
  },
];

export default function RelationshipStep1() {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleSelect = (qid: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [qid]: value }));
  };

  const handleNext = () => {
    localStorage.setItem('relationship-step-1', JSON.stringify(answers));
    router.push('/dashboard/personality/relationship/step-2');
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto px-6 py-16">
        <h1 className="text-2xl font-bold text-indigo-700 mb-6">Relationship Readiness – Step 1 of 5</h1>
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
