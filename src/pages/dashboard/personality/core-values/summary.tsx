import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import zodiacProfiles from '@/lib/zodiacProfiles';
import Image from 'next/image';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';
import DashboardLayout from '@/layouts/DashboardLayout';
import { getCoreValuesResultFromAnswers } from '@/utils/core-values/aggregateCoreValues'; // Import the function to aggregate Core Values

export default function ResumePage() {
  const [user] = useAuthState(auth);
  const [zodiac, setZodiac] = useState(null);
  const [userName, setUserName] = useState('');
  const [audioReady, setAudioReady] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [profileMedia, setProfileMedia] = useState([]);
  const [mbtiType, setMbtiType] = useState('');
  const [visibility, setVisibility] = useState('private');
  const [coreValues, setCoreValues] = useState<string[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setZodiac(localStorage.getItem('onboardingZodiac'));
      setUserName(localStorage.getItem('onboardingName') || 'You');
      setAudioReady(true);
      setAudioURL('/audio/sample-summary.mp3');
    }

    if (user) {
      const fetchResume = async () => {
        const ref = doc(db, 'userResumes', user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          const data = snap.data();
          setMbtiType(data.mbti || '');
          setVisibility(data.visibility || 'private');
          setCoreValues(data.coreValues?.selected || []); // Fetch saved Core Values
        }
      };
      fetchResume();
    }
  }, [user]);

  const updateVisibility = async (level: string) => {
    setVisibility(level);
    if (user) {
      await updateDoc(doc(db, 'userResumes', user.uid), {
        visibility: level,
        updatedAt: new Date()
      });
    }
  };

  const zodiacData = zodiacProfiles[zodiac];

  // Core Values aggregation logic
  useEffect(() => {
    const answers: Record<string, string> = {};

    // Simulate retrieving answers from localStorage (you need to have corresponding answers saved in localStorage)
    for (let i = 1; i <= 10; i++) { // Example, adjust if you have more steps
      const step = localStorage.getItem(`core-values-step-${i}`);
      if (step) {
        const parsed = JSON.parse(step);
        Object.assign(answers, parsed);
      }
    }

    const aggregatedCoreValues = getCoreValuesResultFromAnswers(answers);
    setCoreValues(aggregatedCoreValues);

    if (user?.uid) {
      const ref = doc(db, 'userResumes', user.uid);
      setDoc(ref, {
        coreValues: {
          selected: aggregatedCoreValues,
          updatedAt: new Date(),
        },
      }, { merge: true });
    }
  }, [user]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files!);
    const newFiles = files.map((file) => URL.createObjectURL(file));
    setProfileMedia([...profileMedia, ...newFiles]);
  };

  const removeMedia = (indexToRemove: number) => {
    setProfileMedia((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  return (
    <DashboardLayout>
      <Head>
        <title>{userName}'s LoveGPT Resume</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 p-6">
        <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-6 space-y-8 transition-all duration-300">
          {/* Header */}
          <div className="flex items-center gap-3">
            <Image
              src="/aria-avatar.png"
              alt="ARIA"
              width={48}
              height={48}
              className="rounded-full"
            />
            <div>
              <h1 className="text-2xl font-bold text-pink-600">{userName}'s LoveGPT Resume 💖</h1>
              <p className="text-sm text-gray-500">Curated by ARIA — your emotional AI mirror 🌸</p>
            </div>
          </div>

          {/* Visibility Toggle */}
          <section className="bg-yellow-50 border border-yellow-300 rounded-xl p-4">
            <h2 className="text-lg font-semibold text-yellow-700">🔐 Profile Visibility</h2>
            <select
              className="mt-3 border rounded px-3 py-2 text-sm text-gray-700"
              value={visibility}
              onChange={(e) => updateVisibility(e.target.value)}
            >
              <option value="private">Private — Only you & ARIA</option>
              <option value="semi">Semi-Private — Limited access for others</option>
              <option value="public">Public — Fully shareable</option>
            </select>
          </section>

          {/* MBTI */}
          {mbtiType && (
            <section className="bg-blue-50 border border-blue-300 rounded-xl p-4">
              <h2 className="text-lg font-semibold text-blue-700">🧠 MBTI Type</h2>
              <p className="text-sm text-gray-800 mt-2">Your primary cognitive blueprint is: <strong>{mbtiType}</strong></p>
            </section>
          )}

          {/* Core Values */}
          {coreValues.length > 0 && (
            <section className="bg-teal-50 border border-teal-300 rounded-xl p-4">
              <h2 className="text-lg font-semibold text-teal-700">🌱 Core Values</h2>
              <ul className="grid grid-cols-2 gap-3 mt-3 text-sm text-gray-800">
                <li>
                  <a href="/dashboard/personality/core-values/summary" className="text-pink-600 underline hover:text-pink-700">🌱 View Core Value Summary</a>
                </li>
                {coreValues.map((val, idx) => (
                  <li key={idx} className="bg-white border px-3 py-2 rounded shadow-sm text-center">{val}</li>
                ))}
              </ul>
            </section>
          )}

          {/* Zodiac */}
          {zodiacData && (
            <section className="bg-purple-50 border border-purple-300 rounded-xl p-4">
              <h2 className="text-lg font-semibold text-purple-700">♓ Zodiac Snapshot: {zodiac}</h2>
              <p className="text-sm text-gray-600 mt-1">Element: {zodiacData.element}</p>
              <p className="text-sm text-gray-700 mt-1">Key Traits: {zodiacData.femaleTraits.join(', ')}</p>
              <p className="text-sm text-purple-500 mt-2 italic">“{zodiacData.aiTips[0]}”</p>
            </section>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
