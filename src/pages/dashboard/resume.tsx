import { httpsCallable } from 'firebase/functions';
import { functions } from '@/lib/firebase';
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import zodiacProfiles from '@/lib/zodiacProfiles';
import Image from 'next/image';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/lib/firebase';
import { useRouter } from 'next/router';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import DashboardLayout from '@/layouts/DashboardLayout';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import Link from 'next/link';

export default function ResumePage() {
  const router = useRouter();
  const [user] = useAuthState(auth);
  const [zodiac, setZodiac] = useState(null);
  const [userName, setUserName] = useState('');
  const [mbtiType, setMbtiType] = useState('');
  const [visibility, setVisibility] = useState('private');
  const [coreValues, setCoreValues] = useState<string[]>([]);
  const [nlpAnswers, setNlpAnswers] = useState<string[]>([]);
  const [enneagramAnswers, setEnneagramAnswers] = useState<string[]>([]);
  const [relationshipAnswers, setRelationshipAnswers] = useState<string[]>([]);
  const [readinessScores, setReadinessScores] = useState<any>({});
  const [ariaSummary, setAriaSummary] = useState('');
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    if (!user) {
      router.push('/');
      return;
    }
    if (typeof window !== 'undefined') {
      setZodiac(localStorage.getItem('onboardingZodiac'));
      setUserName(localStorage.getItem('onboardingName') || 'You');
    }
    const fetchResume = async () => {
      const ref = doc(db, 'userResumes', user.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        setMbtiType(data.mbti || '');
        setVisibility(data.visibility || 'private');
        setCoreValues(data.coreValues?.selected || []);
        setNlpAnswers(data.nlpStyle?.answers || []);
        setEnneagramAnswers(data.enneagram?.answers || []);
        setRelationshipAnswers(data.relationshipReadiness?.answers || []);
        setReadinessScores(data.readinessScores || {});
        setAriaSummary(data.ariaSummary || 'ARIA is still preparing your personalized summary...');
      }
    };
    fetchResume();
  }, [user, router]);

  const triggerSummary = async () => {
    if (!user) return;
    setGenerating(true);
    try {
      const generateSummary = httpsCallable(functions, 'generateResumeSummary');
      const result = await generateSummary({ uid: user.uid });
      console.log('✅ AI Summary generated:', result.data);
      alert('✨ ARIA summary refreshed!');
    } catch (error) {
      console.error('❌ Error generating summary:', error);
      alert('❌ Failed to generate summary.');
    } finally {
      setGenerating(false);
    }
  };

  const updateVisibility = async (level: string) => {
    setVisibility(level);
    if (user) {
      await updateDoc(doc(db, 'userResumes', user.uid), {
        visibility: level,
        updatedAt: new Date(),
      });
    }
  };

  const zodiacData = zodiacProfiles[zodiac];

  return (
    <DashboardLayout>
      <Head>
        <title>{userName}'s LoveGPT Resume</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 p-6">
        <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-6 space-y-8 transition-all duration-300">

          {/* Header */}
          <div className="flex items-center gap-3">
            <Image src="/aria-avatar.png" alt="ARIA" width={48} height={48} className="rounded-full" />
            <div>
              <h1 className="text-2xl font-bold text-pink-600">{userName}'s LoveGPT Resume 💖</h1>
              <p className="text-sm text-gray-500">Curated by ARIA — your emotional AI mirror 🌸</p>
            </div>
          </div>

          {/* Sidebar Navigation Suggestion */}
          <nav className="hidden">
            <ul>
              <li>
                <Link href="/dashboard/resume" className="hover:text-indigo-600">
                  📄 My Resume
                </Link>
              </li>
            </ul>
          </nav>

          {/* Trigger AI Summary */}
          <div className="text-right">
            <button
              onClick={triggerSummary}
              className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 disabled:opacity-60"
              disabled={generating}
            >
              {generating ? 'Generating AI Summary...' : '🔄 Generate AI Summary'}
            </button>
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
              <p className="text-sm text-gray-800 mt-2">Your cognitive blueprint: <strong>{mbtiType}</strong></p>
            </section>
          )}

          {/* Core Values */}
          {coreValues.length > 0 && (
            <section className="bg-teal-50 border border-teal-300 rounded-xl p-4">
              <h2 className="text-lg font-semibold text-teal-700">🌱 Core Values</h2>
              <ul className="grid grid-cols-2 gap-3 mt-3 text-sm text-gray-800">
                {coreValues.map((val, idx) => (
                  <li key={idx} className="bg-white border px-3 py-2 rounded shadow-sm text-center">{val}</li>
                ))}
              </ul>
            </section>
          )}

          {/* NLP */}
          {nlpAnswers.length > 0 && (
            <section className="bg-pink-50 border border-pink-300 rounded-xl p-4">
              <h2 className="text-lg font-semibold text-pink-700">🧠 NLP Communication Style</h2>
              <ul className="list-disc list-inside text-sm text-gray-800 mt-2">
                {nlpAnswers.map((ans, i) => <li key={i}>{ans}</li>)}
              </ul>
            </section>
          )}

          {/* Enneagram */}
          {enneagramAnswers.length > 0 && (
            <section className="bg-purple-50 border border-purple-300 rounded-xl p-4">
              <h2 className="text-lg font-semibold text-purple-700">🌀 Enneagram Snapshot</h2>
              <ul className="list-disc list-inside text-sm text-gray-800 mt-2">
                {enneagramAnswers.map((ans, i) => <li key={i}>{ans}</li>)}
              </ul>
            </section>
          )}

          {/* Relationship Readiness */}
          {relationshipAnswers.length > 0 && (
            <section className="bg-rose-50 border border-rose-300 rounded-xl p-4">
              <h2 className="text-lg font-semibold text-rose-700">💞 Relationship Readiness</h2>
              <ul className="list-disc list-inside text-sm text-gray-800 mt-2">
                {relationshipAnswers.map((ans, i) => <li key={i}>{ans}</li>)}
              </ul>
            </section>
          )}

          {/* Love Readiness Radar */}
          {readinessScores && Object.keys(readinessScores).length > 0 && (
            <section className="bg-indigo-50 border border-indigo-200 rounded-xl p-4">
              <h2 className="text-lg font-semibold text-indigo-700 mb-4">📈 Love Readiness Overview</h2>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={Object.entries(readinessScores).map(([key, value]) => ({ subject: key, A: value }))}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} />
                  <Radar name="You" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.4} />
                </RadarChart>
              </ResponsiveContainer>
            </section>
          )}

          {/* ARIA Summary */}
          {ariaSummary && (
            <section className="bg-white border border-indigo-300 rounded-xl p-4">
              <h2 className="text-lg font-semibold text-indigo-700 mb-2">🗣️ ARIA’s Personalized Insight</h2>
              <p className="text-sm text-gray-700 whitespace-pre-line">{ariaSummary}</p>
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
