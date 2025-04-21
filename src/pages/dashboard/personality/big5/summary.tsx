import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc } from 'firebase/firestore';
import Head from 'next/head';
import DashboardLayout from '@/layouts/DashboardLayout';

export default function Big5Summary() {
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(true);
  const [traits, setTraits] = useState({
    Openness: 0,
    Conscientiousness: 0,
    Extraversion: 0,
    Agreeableness: 0,
    Neuroticism: 0,
  });

  useEffect(() => {
    const traitMap = {
      big5_1: 'Extraversion', big5_5: 'Openness', big5_9: 'Openness',
      big5_13: 'Openness', big5_17: 'Extraversion', big5_21: 'Openness',
      big5_25: 'Extraversion', big5_29: 'Extraversion', big5_33: 'Openness',
      big5_37: 'Extraversion',
      big5_2: 'Agreeableness', big5_6: 'Agreeableness', big5_10: 'Agreeableness',
      big5_14: 'Agreeableness', big5_18: 'Agreeableness', big5_22: 'Agreeableness',
      big5_26: 'Agreeableness', big5_30: 'Agreeableness', big5_34: 'Agreeableness',
      big5_38: 'Agreeableness',
      big5_3: 'Conscientiousness', big5_7: 'Conscientiousness', big5_11: 'Conscientiousness',
      big5_15: 'Conscientiousness', big5_19: 'Conscientiousness', big5_23: 'Conscientiousness',
      big5_27: 'Conscientiousness', big5_31: 'Conscientiousness', big5_35: 'Conscientiousness',
      big5_39: 'Conscientiousness',
      big5_4: 'Neuroticism', big5_8: 'Neuroticism', big5_12: 'Neuroticism',
      big5_16: 'Neuroticism', big5_20: 'Neuroticism', big5_24: 'Neuroticism',
      big5_28: 'Neuroticism', big5_32: 'Neuroticism', big5_36: 'Neuroticism',
      big5_40: 'Neuroticism',
    };

    const weights = {
      'Strongly Disagree': 1,
      'Disagree': 2,
      'Neutral': 3,
      'Agree': 4,
      'Strongly Agree': 5,
    };

    const temp = { Openness: 0, Conscientiousness: 0, Extraversion: 0, Agreeableness: 0, Neuroticism: 0 };

    for (let i = 1; i <= 10; i++) {
      const step = localStorage.getItem(`big5-step-${i}`);
      if (step) {
        const parsed = JSON.parse(step);
        for (let qid in parsed) {
          const trait = traitMap[qid];
          if (trait) {
            temp[trait] += weights[parsed[qid]] || 0;
          }
        }
      }
    }

    setTraits(temp);
    setLoading(false);

    if (user?.uid) {
      const ref = doc(db, 'userResumes', user.uid);
      setDoc(ref, {
        big5: {
          traits: temp,
          updatedAt: new Date(),
        }
      }, { merge: true });
    }
  }, [user]);

  if (loading) return <div className="text-center p-20">Analyzing your results...</div>;

  const topTrait = Object.entries(traits).sort((a, b) => b[1] - a[1])[0][0];

  return (
    <DashboardLayout>
      <Head>
        <title>Big 5 Personality Summary | LoveGPT</title>
      </Head>
      <div className="max-w-2xl mx-auto px-6 py-16">
        <h1 className="text-3xl font-bold text-indigo-700 mb-4">🧬 Big 5 Personality Summary</h1>
        <p className="text-lg mb-4">Your strongest trait is:</p>
        <h2 className="text-2xl font-semibold text-pink-600">{topTrait}</h2>

        <div className="mt-6">
          <h3 className="text-md font-semibold mb-2">Trait Breakdown:</h3>
          <ul className="list-disc ml-6 text-sm text-gray-700">
            {Object.entries(traits).map(([key, val]) => (
              <li key={key}>{key}: {val}</li>
            ))}
          </ul>
        </div>

        <div className="mt-10 text-right">
          <a
            href="/dashboard/resume"
            className="bg-pink-600 text-white px-6 py-2 rounded-lg hover:bg-pink-700"
          >
            Return to Resume
          </a>
        </div>
      </div>
    </DashboardLayout>
  );
}
