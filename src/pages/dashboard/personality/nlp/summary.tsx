import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import Head from 'next/head';
import DashboardLayout from '@/layouts/DashboardLayout';
import { getNLPResultFromAnswers } from '@/utils/nlp/aggregateNLP'; // Import the function

export default function NlpSummary() {
  const [user] = useAuthState(auth);
  const [answers, setAnswers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [nlpStyle, setNlpStyle] = useState('');

  useEffect(() => {
    const collected: string[] = [];
    for (let i = 1; i <= 5; i++) { // Assuming 5 steps, adjust if needed
      const step = localStorage.getItem(`nlp-step-${i}`);
      if (step) {
        const parsed = JSON.parse(step);
        Object.values(parsed).forEach((val) => {
          if (typeof val === 'string') collected.push(val);
        });
      }
    }
    setAnswers(collected);

    // Get NLP result using the aggregate function
    const result = getNLPResultFromAnswers(collected);
    setNlpStyle(result);

    setLoading(false);

    // Save NLP result to Firestore
    if (user?.uid) {
      const ref = doc(db, 'userResumes', user.uid);
      setDoc(ref, {
        nlpStyle: {
          style: result,
          answers: collected,
          updatedAt: new Date(),
        },
      }, { merge: true });
    }
  }, [user]);

  if (loading) return <div className="text-center p-20">Compiling your NLP summary...</div>;

  const nlpDescriptions: Record<string, string> = {
    Visual: 'Visual – You process and communicate best through images, charts, and visual representations.',
    Auditory: 'Auditory – You prefer to process information through sounds, music, and verbal communication.',
    Kinesthetic: 'Kinesthetic – You communicate best through touch, physical gestures, and hands-on activities.',
  };

  return (
    <DashboardLayout>
      <Head>
        <title>Your NLP Summary | LoveGPT</title>
      </Head>

      <div className="max-w-2xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold text-indigo-700 mb-4">🧠 Your NLP Communication Style</h1>
        <p className="text-gray-600 mb-4">You tend to process and communicate best through:</p>
        <h2 className="text-2xl font-semibold text-pink-600">{nlpStyle} – {nlpDescriptions[nlpStyle]}</h2>

        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-2">💡 Breakdown:</h3>
          <ul className="list-disc ml-6 text-sm text-gray-700">
            {answers.map((ans, i) => (
              <li key={i} className="mb-2">{ans}</li>
            ))}
          </ul>
        </div>

        <div className="mt-10 text-right">
          <a
            href="/dashboard/resume"
            className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700"
          >
            Back to Resume
          </a>
        </div>
      </div>
    </DashboardLayout>
  );
}
