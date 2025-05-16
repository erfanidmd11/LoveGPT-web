import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import DashboardLayout from '@/layouts/DashboardLayout';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { getParenthoodResultFromAnswers } from '@/utils/parenthood/aggregateParenthood'; // Import the function

export default function ParenthoodSummary() {
  const [user] = useAuthState(auth);
  const [answers, setAnswers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [parenthoodResult, setParenthoodResult] = useState('');

  useEffect(() => {
    const loadedAnswers: string[] = [];
    for (let i = 1; i <= 10; i++) { // Assuming 10 steps, adjust if needed
      const answer = localStorage.getItem(`parenthood-step${i}`);
      if (answer) loadedAnswers.push(answer);
    }
    setAnswers(loadedAnswers);

    // Get Parenthood result using the aggregate function
    const result = getParenthoodResultFromAnswers(loadedAnswers);
    setParenthoodResult(result);

    setLoading(false);

    // Save Parenthood result to Firestore
    if (user?.uid) {
      const ref = doc(db, 'userResumes', user.uid);
      setDoc(ref, {
        parenthood: {
          result: result,
          answers: loadedAnswers,
          updatedAt: new Date(),
        },
      }, { merge: true });
    }
  }, [user]);

  if (loading) return <div className="text-center p-20">Compiling your Parenthood summary...</div>;

  const descriptions: Record<string, string> = {
    'Emotional Readiness': 'You are emotionally prepared for a committed relationship, with the ability to empathize and understand the needs of your partner.',
    'Commitment Readiness': 'You are ready to commit to a long-term relationship, with a focus on loyalty, responsibility, and shared goals.',
    'Growth Readiness': 'You are open to growth and change, recognizing the need for personal and relational development as part of your relationship journey.',
  };

  return (
    <DashboardLayout>
      <Head>
        <title>Parenthood Readiness Summary | LoveGPT</title>
      </Head>

      <div className="max-w-3xl mx-auto py-12 px-6">
        <h1 className="text-3xl font-bold text-pink-600 mb-6">👶 Parenthood Readiness Summary</h1>

        <p className="text-gray-700 text-md mb-6">
          Based on your responses, here’s a snapshot of how you view parenting, responsibility, and emotional legacy.
          These insights will help ARIA guide your relationship journey — and future decisions about family.
        </p>

        {answers.length > 0 ? (
          <section className="bg-rose-50 border border-rose-300 rounded-xl p-4 mb-8">
            <ul className="list-disc list-inside text-sm text-gray-800">
              {answers.map((ans, i) => (
                <li key={i} className="mb-2">{ans}</li>
              ))}
            </ul>
          </section>
        ) : (
          <p className="text-gray-500 italic">No readiness data found. Complete your relationship questions to generate insights.</p>
        )}

        <div className="mt-6">
          <h2 className="text-2xl font-semibold text-pink-600">Your Dominant Parenthood Trait:</h2>
          <p className="text-lg text-gray-700">{parenthoodResult} - {descriptions[parenthoodResult]}</p>
        </div>

        <div className="mt-10 text-center">
          <p className="text-sm text-gray-500">
            Want to update your answers? Just revisit any step from 1–10 or retake the parenthood assessment.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
