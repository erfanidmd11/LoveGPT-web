import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import DashboardLayout from '@/layouts/DashboardLayout';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { getRelationshipReadinessResultFromAnswers } from '@/utils/relationship/aggregateRelationship'; // Import the function

export default function RelationshipSummary() {
  const [user] = useAuthState(auth);
  const [answers, setAnswers] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [relationshipReadiness, setRelationshipReadiness] = useState('');

  useEffect(() => {
    const loadedAnswers: string[] = [];
    for (let i = 1; i <= 5; i++) { // Assuming 5 steps, adjust if needed
      const answer = localStorage.getItem(`relationship-step-${i}`);
      if (answer) loadedAnswers.push(answer);
    }
    setAnswers(loadedAnswers);

    // Get Relationship Readiness result using the aggregate function
    const result = getRelationshipReadinessResultFromAnswers(loadedAnswers);
    setRelationshipReadiness(result);

    setLoading(false);

    // Save Relationship Readiness result to Firestore
    if (user?.uid) {
      const ref = doc(db, 'userResumes', user.uid);
      setDoc(ref, {
        relationshipReadiness: {
          result: result,
          answers: loadedAnswers,
          updatedAt: new Date(),
        },
      }, { merge: true });
    }
  }, [user]);

  if (loading) return <div className="text-center p-20">Preparing your relationship profile...</div>;

  const descriptions: Record<string, string> = {
    'Emotional Readiness': 'You are emotionally prepared for a committed relationship, with the ability to empathize and understand the needs of your partner.',
    'Commitment Readiness': 'You are ready to commit to a long-term relationship, with a focus on loyalty, responsibility, and shared goals.',
    'Growth Readiness': 'You are open to growth and change, recognizing the need for personal and relational development as part of your relationship journey.',
  };

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

        <div className="mt-6">
          <h2 className="text-2xl font-semibold text-pink-600">Your Dominant Relationship Trait:</h2>
          <p className="text-lg text-gray-700">{relationshipReadiness} - {descriptions[relationshipReadiness]}</p>
        </div>

        <div className="mt-10 text-center">
          <p className="text-sm text-gray-500">
            Want to update your answers? Just revisit any step from 1–5 or retake the relationship readiness assessment.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
