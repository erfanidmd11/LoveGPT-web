import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { db, auth } from '@/lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, getDoc } from 'firebase/firestore';
import Head from 'next/head';
import MainLayout from '@/layouts/MainLayout';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, PieChart, Pie, Cell
} from 'recharts';

export default function PublicProfile() {
  const router = useRouter();
  const { handle } = router.query;
  const [user] = useAuthState(auth);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [visibility, setVisibility] = useState<'private' | 'semi' | 'public'>('private');
  const [ownerUid, setOwnerUid] = useState('');

  useEffect(() => {
    if (!handle) return;
    async function fetchProfile() {
      const handleRef = doc(db, 'userHandles', handle as string);
      const handleSnap = await getDoc(handleRef);
      if (!handleSnap.exists()) {
        setProfile(null);
        setLoading(false);
        return;
      }

      const uid = handleSnap.data().uid;
      setOwnerUid(uid);

      const resumeRef = doc(db, 'userResumes', uid);
      const resumeSnap = await getDoc(resumeRef);

      if (resumeSnap.exists()) {
        const data = resumeSnap.data();
        setProfile(data);
        setVisibility(data.visibility || 'private');
      }
      setLoading(false);
    }
    fetchProfile();
  }, [handle]);

  if (loading) return <div className="p-20 text-center">⏳ Loading profile...</div>;
  if (!profile) return <div className="p-20 text-center text-gray-500">❌ Profile not found</div>;

  const isOwner = user?.uid === ownerUid;
  if (visibility === 'private' && !isOwner) {
    return <div className="p-20 text-center text-gray-500">🔒 This profile is private.</div>;
  }

  const discData = profile.disc?.scores && Object.entries(profile.disc.scores).map(([trait, value]) => ({ trait, value }));
  const big5Data = profile.big5?.scores && Object.entries(profile.big5.scores).map(([trait, value]) => ({ trait, value }));
  const readinessData = profile.readiness?.categories && Object.entries(profile.readiness.categories).map(([category, value]) => ({ name: category, value }));
  const pieColors = ['#f59e0b', '#10b981', '#6366f1', '#ec4899', '#ef4444'];

  const aiSummary = profile.aiInsights || null;

  return (
    <MainLayout>
      <Head>
        <title>View Profile | LoveGPT</title>
      </Head>

      <div className="max-w-3xl mx-auto px-6 py-16 text-gray-800">
        <h1 className="text-3xl font-bold mb-4 text-indigo-700">💫 LoveGPT Public Resume</h1>

        <div className="bg-white shadow p-6 rounded-xl space-y-6">
          {aiSummary && (
            <div className="bg-gradient-to-br from-indigo-50 to-pink-50 border border-indigo-200 p-4 rounded-xl">
              <h2 className="text-xl font-semibold text-indigo-700 mb-2">🤖 ARIA Insight Summary</h2>
              <p className="text-sm text-gray-700 whitespace-pre-line">{aiSummary}</p>
            </div>
          )}

          <div>
            <h2 className="text-xl font-semibold text-pink-600 mb-2">MBTI Type</h2>
            <p className="text-gray-700">{profile.mbti || 'Not provided yet'}</p>
          </div>

          {profile.disc?.dominant && (
            <div>
              <h2 className="text-xl font-semibold text-green-600 mb-2">📊 DISC Type</h2>
              <p className="text-gray-700">Dominant: {profile.disc.dominant}</p>
              {discData && (
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={discData}>
                    <XAxis dataKey="trait" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#34d399" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          )}

          {profile.big5?.answers?.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-blue-600 mb-2">🧬 Big 5 Traits</h2>
              <ul className="list-disc ml-5 text-gray-700">
                {profile.big5.answers.map((ans: string, idx: number) => (
                  <li key={idx}>{ans}</li>
                ))}
              </ul>
              {big5Data && (
                <ResponsiveContainer width="100%" height={250}>
                  <RadarChart data={big5Data} outerRadius={90}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="trait" />
                    <PolarRadiusAxis />
                    <Radar dataKey="value" stroke="#6366f1" fill="#6366f1" fillOpacity={0.6} />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              )}
            </div>
          )}

          {readinessData && (
            <div>
              <h2 className="text-xl font-semibold text-rose-600 mb-2">💞 Readiness Score</h2>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    dataKey="value"
                    data={readinessData}
                    cx="50%"
                    cy="50%"
                    outerRadius={90}
                    label
                  >
                    {readinessData.map((_, i) => (
                      <Cell key={`cell-${i}`} fill={pieColors[i % pieColors.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}

          {profile.nlpStyle?.answers?.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-pink-600 mb-2">🧠 NLP Style</h2>
              <ul className="list-disc ml-5 text-gray-700">
                {profile.nlpStyle.answers.map((ans: string, idx: number) => (
                  <li key={idx}>{ans}</li>
                ))}
              </ul>
            </div>
          )}

          {profile.enneagram?.answers?.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-purple-600 mb-2">🌀 Enneagram</h2>
              <ul className="list-disc ml-5 text-gray-700">
                {profile.enneagram.answers.map((ans: string, idx: number) => (
                  <li key={idx}>{ans}</li>
                ))}
              </ul>
            </div>
          )}

          {profile.coreValues?.selected?.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold text-emerald-600 mb-2">🌱 Core Values</h2>
              <ul className="grid grid-cols-2 gap-2 text-gray-700">
                {profile.coreValues.selected.map((val: string, idx: number) => (
                  <li key={idx} className="border rounded p-2 text-center">{val}</li>
                ))}
              </ul>
            </div>
          )}

          {profile.zodiac && (
            <div>
              <h2 className="text-xl font-semibold text-purple-700 mb-2">♓ Zodiac</h2>
              <p className="text-gray-700">{profile.zodiac}</p>
            </div>
          )}
        </div>

        {visibility === 'semi' && !isOwner && (
          <div className="mt-6 text-sm text-gray-500 italic text-center">
            🕶️ This is a semi-private profile. Some sections may be hidden.
          </div>
        )}
      </div>
    </MainLayout>
  );
}
