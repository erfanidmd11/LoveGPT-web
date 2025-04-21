import Head from 'next/head';
import MainLayout from '@/layouts/MainLayout';
import { useEffect, useState } from 'react';
import { getMBTIResultFromAnswers } from '@/utils/mbti/aggregateMBTI';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import Head from 'next/head';
import DashboardLayout from '@/layouts/DashboardLayout'; // ✅ Add this last

export default function ResumePage() {
  return (
    <DashboardLayout>
      {/* Your page JSX here */}
    </DashboardLayout>
  );
}

export default function MBTISummary() {
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(true);
  const [mbti, setMBTI] = useState('');
  const [zodiac, setZodiac] = useState('');
  const [gender, setGender] = useState('');
  const [summary, setSummary] = useState('');

  useEffect(() => {
    async function fetchData() {
      let allAnswers = {};
      for (let i = 1; i <= 24; i++) {
        const step = localStorage.getItem(`mbti-step-${i}`);
        if (step) Object.assign(allAnswers, JSON.parse(step));
      }
      const result = getMBTIResultFromAnswers(allAnswers);

        // Save MBTI result to Firestore resume
        if (user?.uid) {
          const resumeRef = doc(db, 'userResumes', user.uid);
          await setDoc(resumeRef, {
            mbti: result,
            updatedAt: Timestamp.now(),
          }, { merge: true });
        }
      setMBTI(result);

      const userRef = doc(db, 'users', user?.uid || '');
      const userSnap = await getDoc(userRef);
      const userData = userSnap.data();
      setZodiac(userData?.zodiac || '');
      setGender(userData?.gender || '');

      setSummary(
        `As a ${gender} ${zodiac}, your dominant MBTI type is ${result}. This profile will evolve as you complete additional tests like DISC, Enneagram, and Big Five — and as ARIA learns more about your personality through chats, behavior, and preferences.`
      );
      setLoading(false);
    }
    fetchData();
  }, [user]);

  if (loading) return <div className="text-center p-20">⏳ Analyzing your results...</div>;

  return (
    <MainLayout>
      <Head>
        <title>Your Personality Profile | LoveGPT</title>
      </Head>
      <div className="max-w-3xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold text-indigo-700 mb-4">🧠 Your LoveGPT AI Personality Summary</h1>
        <p className="text-lg text-gray-600 mb-6">
          This is your MBTI-based personality profile — a living, evolving document powered by your test inputs and ARIA’s observations.
        </p>

        <div className="bg-white shadow p-6 rounded-xl mb-6">
          <h2 className="text-2xl text-pink-600 font-bold mb-2">MBTI Type: {mbti}</h2>
          <p className="text-gray-700">{summary}</p>
        </div>

        <div className="bg-white shadow p-6 rounded-xl">
          <h3 className="text-lg font-semibold mb-2 text-indigo-700">Next Steps:</h3>
          <ul className="list-disc ml-5 text-sm text-gray-700">
            <li>Start your DISC personality assessment</li>
            <li>Explore Core Values, Enneagram, and Big Five</li>
            <li>Interact with ARIA — your profile updates in real time</li>
          </ul>
        </div>
      </div>
    </MainLayout>
  );
}
