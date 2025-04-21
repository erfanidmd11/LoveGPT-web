import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import Head from 'next/head';
import DashboardLayout from '@/layouts/DashboardLayout';
import Link from 'next/link';

export default function RelationshipSummary() {
  const [user] = useAuthState(auth);
  const [answers, setAnswers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const collected: string[] = [];
    for (let i = 1; i <= 5; i++) {
      const step = localStorage.getItem(`relationship-step-${i}`);
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
        relationshipReadiness: {
          answers: collected,
          updatedAt: new Date(),
        },
      }, { merge: true });
    }
  }, [user]);

  if (loading) return <div className="text-center p-20">Preparing your relationship profile...</div>;

  return (
    <DashboardLayout>
      <Head>
        <title>Your Relationship Readiness | LoveGPT</title>
      </Head>
      <div className="max-w-2xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold text-indigo-700 mb-4">💞 Relationship Readiness Summary</h1>
        <p className="text-gray-600 mb-4">Here’s how you show up when it comes to love, commitment, and emotional growth:</p>

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

        <div className="mt-10 flex justify-between items-center">
          <Link
            href="/dashboard/resume"
            className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700"
          >
            ← Back to Resume
          </Link>
          <Link
            href="/dashboard/settings"
            className="text-sm text-indigo-600 hover:underline"
          >
            Go to Settings
          </Link>
        </div>
      </div>
    </DashboardLayout>
  );
}
