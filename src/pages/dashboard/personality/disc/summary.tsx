import { useEffect, useState } from 'react';
import Head from 'next/head';
import MainLayout from '@/layouts/MainLayout';
import DashboardLayout from '@/layouts/DashboardLayout';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { getDISCResultFromAnswers } from '@/utils/disc/aggregateDISC'; // Import the function

export default function ResumePage() {
  return (
    <DashboardLayout>
      <div className="p-6 text-center text-gray-500">Page Coming Soon</div>
    </DashboardLayout>
  );
}

export function DISCSummary() {
  const [scores, setScores] = useState({ D: 0, I: 0, S: 0, C: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const processDISC = async () => {
      const collected: string[] = [];
      for (let i = 1; i <= 6; i++) {
        const step = localStorage.getItem(`disc-step-${i}`);
        if (step) {
          const parsed = JSON.parse(step);
          Object.values(parsed).forEach((val) => {
            if (typeof val === 'string') collected.push(val);
          });
        }
      }

      // Aggregate DISC result
      const result = getDISCResultFromAnswers(collected);
      setScores({
        D: result === 'D' ? 1 : 0,
        I: result === 'I' ? 1 : 0,
        S: result === 'S' ? 1 : 0,
        C: result === 'C' ? 1 : 0
      });

      // Save DISC result to Firestore
      if (typeof window !== 'undefined') {
        const uid = localStorage.getItem('user_uid');
        if (uid) {
          const ref = doc(db, 'userResumes', uid);
          await setDoc(ref, {
            disc: {
              scores,
              dominant: result,
              updatedAt: new Date(),
            },
            updatedAt: new Date(),
          }, { merge: true });
        }
      }

      setLoading(false);
    };

    processDISC();
  }, []);

  if (loading) return <div className="text-center p-20">🔄 Calculating your DISC profile...</div>;

  const descriptions: Record<string, string> = {
    D: 'Dominance – Driven, results-oriented, and competitive.',
    I: 'Influence – Enthusiastic, persuasive, and highly sociable.',
    S: 'Steadiness – Loyal, patient, and peace-seeking.',
    C: 'Conscientiousness – Detail-oriented, analytical, and organized.'
  };

  return (
    <MainLayout>
      <Head>
        <title>Your DISC Result | LoveGPT</title>
      </Head>
      <div className="max-w-2xl mx-auto px-6 py-16 text-gray-800">
        <h1 className="text-3xl font-bold text-indigo-700 mb-4">📊 Your DISC Personality Type</h1>
        <p className="mb-4">Your dominant DISC type is:</p>
        <h2 className="text-2xl font-semibold text-pink-600">{scores.D ? 'D' : scores.I ? 'I' : scores.S ? 'S' : 'C'} — {descriptions[scores.D ? 'D' : scores.I ? 'I' : scores.S ? 'S' : 'C']}</h2>

        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-2">💡 Breakdown:</h3>
          <ul className="list-disc ml-6 text-sm text-gray-700">
            <li>Dominance (D): {scores.D}</li>
            <li>Influence (I): {scores.I}</li>
            <li>Steadiness (S): {scores.S}</li>
            <li>Conscientiousness (C): {scores.C}</li>
          </ul>
        </div>
      </div>
    </MainLayout>
  );
}
