import { useEffect, useState } from 'react';
import Head from 'next/head';
import MainLayout from '@/layouts/MainLayout';
import Head from 'next/head';
import DashboardLayout from '@/layouts/DashboardLayout'; // ✅ Add this last

export default function ResumePage() {
  return (
    <DashboardLayout>
      {/* Your page JSX here */}
    </DashboardLayout>
  );
}

export default function DISCSummary() {
  const [scores, setScores] = useState({ D: 0, I: 0, S: 0, C: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const categoryMap: Record<string, keyof typeof scores> = {
      disc1: 'D', disc5: 'D', disc9: 'D', disc13: 'D', disc20: 'D', disc22: 'D',
      disc4: 'I', disc8: 'I', disc12: 'I', disc16: 'I', disc19: 'I', disc23: 'I',
      disc2: 'S', disc6: 'S', disc10: 'S', disc14: 'S', disc18: 'S', disc24: 'S',
      disc3: 'C', disc7: 'C', disc11: 'C', disc15: 'C', disc17: 'C', disc21: 'C'
    };

    const weightMap = {
      'Strongly Disagree': 1,
      'Disagree': 2,
      'Neutral': 3,
      'Agree': 4,
      'Strongly Agree': 5
    };

    let tempScores = { D: 0, I: 0, S: 0, C: 0 };

    for (let i = 1; i <= 6; i++) {
      const step = localStorage.getItem(`disc-step-${i}`);
      if (step) {
        const parsed = JSON.parse(step);
        for (let qId in parsed) {
          const type = categoryMap[qId];
          if (type) tempScores[type] += weightMap[parsed[qId]] || 0;
        }
      }
    }
    setScores(tempScores);

    // Save DISC result to Firestore
    if (typeof window !== 'undefined') {
      const uid = localStorage.getItem('user_uid');
      if (uid) {
        const ref = doc(db, 'userResumes', uid);
        await setDoc(ref, {
          disc: {
            scores: tempScores,
            dominant: Object.entries(tempScores).sort((a, b) => b[1] - a[1])[0][0],
          },
          updatedAt: new Date(),
        }, { merge: true });
      }
    }
    setLoading(false);
  }, []);

  if (loading) return <div className="text-center p-20">🔄 Calculating your DISC profile...</div>;

  const highest = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];

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
        <h2 className="text-2xl font-semibold text-pink-600">{highest} — {descriptions[highest]}</h2>

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
