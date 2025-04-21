import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import Head from 'next/head';
import DashboardLayout from '@/layouts/DashboardLayout';

export default function EnneaSummary() {
  const [user] = useAuthState(auth);
  const [answers, setAnswers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const collected: string[] = [];
    for (let i = 1; i <= 5; i++) {
      const step = localStorage.getItem(`ennea-step-${i}`);
      if (step) {
        const parsed = JSON.parse(step);
        Object.values(parsed).forEach((val) => collected.push(val));
      }
    }
    setAnswers(collected);
    setLoading(false);

    if (user?.uid) {
      const ref = doc(db, 'userResumes', user.uid);
      setDoc(ref, {
        enneagram: {
          answers: collected,
          updatedAt: new Date(),
        },
      }, { merge: true });
    }
  }, [user]);

  if (loading) return <div className="text-center p-20">Analyzing your Enneagram insights...</div>;

  return (
    <DashboardLayout>
      <Head>
        <title>Your Enneagram Summary | LoveGPT</title>
      </Head>

      <div className="max-w-2xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold text-indigo-700 mb-4">🌀 Your Enneagram Snapshot</h1>
        <p className="text-gray-600 mb-4">These motivations and patterns give insight into your emotional and relational blueprint:</p>

        <ul className="list-disc list-inside text-sm text-gray-800">
          {answers.map((ans, i) => (
            <li key={i} className="mb-2">{ans}</li>
          ))}
        </ul>

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
