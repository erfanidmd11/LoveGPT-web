import React, { useEffect, useState } from 'react';
import DashboardLayout from '@/layouts/DashboardLayout';
import Head from 'next/head';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export default function ParenthoodSummary() {
  const [user] = useAuthState(auth);
  const [answers, setAnswers] = useState<string[]>([]);

  useEffect(() => {
    const loadedAnswers: string[] = [];
    for (let i = 1; i <= 10; i++) {
      const answer = localStorage.getItem(`parenthood-step${i}`);
      if (answer) loadedAnswers.push(answer);
    }
    setAnswers(loadedAnswers);

    // Firestore sync
    const syncToFirestore = async () => {
      if (user && loadedAnswers.length === 10) {
        const ref = doc(db, 'userResumes', user.uid);
        await setDoc(ref, {
          parenthood: {
            answers: loadedAnswers,
            updatedAt: new Date(),
          }
        }, { merge: true });
      }
    };

    syncToFirestore();
  }, [user]);

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
          <ul className="list-disc pl-6 space-y-3 text-gray-800">
            {answers.map((ans, i) => (
              <li key={i} className="bg-white rounded-md shadow p-4 border border-pink-100">
                <span className="font-semibold text-pink-600">Q{i + 1}:</span> {ans}
              </li>
            ))}
          </ul>
        ) : (
          <div className="text-center text-gray-500">
            <p>No answers found. Please complete the parenthood questionnaire to generate your summary.</p>
          </div>
        )}

        <div className="mt-10 text-center">
          <p className="text-sm text-gray-500">
            Want to update your answers? Just revisit any step from 1–10 or retake the parenthood assessment.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
