import React, { useState } from 'react';
import { useRouter } from 'next/router';
import DashboardLayout from '@/layouts/DashboardLayout';

const questions = [
  {
    id: 'nlp_1',
    text: 'When learning something new, I prefer:',
    options: [
      'Watching a video or seeing visual examples',
      'Listening to someone explain it to me',
      'Doing it myself through trial and error',
    ],
  },
  {
    id: 'nlp_2',
    text: 'When recalling a past experience, I usually remember:',
    options: [
      'How things looked and appeared',
      'What was said or heard',
      'The physical sensations I felt',
    ],
  },
];

export default function NlpStep1() {
  const router = useRouter();
  const [answers, setAnswers] = useState<Record<string, string>>({});

  const handleSelect = (qid: string, option: string) => {
    setAnswers((prev) => ({ ...prev, [qid]: option }));
  };

  const handleNext = () => {
    localStorage.setItem('nlp-step-1', JSON.stringify(answers));
    router.push('/dashboard/personality/nlp/step-2');
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto px-6 py-16">
        <h1 className="text-2xl font-bold text-indigo-700 mb-6">NLP Style – Step 1 of 5</h1>
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
