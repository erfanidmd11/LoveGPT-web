import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useRouter } from 'next/router';
import { auth, db } from '@/lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import MainLayout from '@/layouts/MainLayout';

export default function DashboardFlags() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const [flags, setFlags] = useState<any[]>([]);
  const [loadingFlags, setLoadingFlags] = useState(true);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
    if (user) fetchFlags();
  }, [user, loading]);

  const fetchFlags = async () => {
    setLoadingFlags(true);
    const ref = collection(db, 'flaggedMatches');
    const q = query(ref, where('flaggedBy', '==', user?.uid));
    const snapshot = await getDocs(q);
    const results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setFlags(results);
    setLoadingFlags(false);
  };

  if (loading || !user) return null;

  return (
    <MainLayout>
      <Head>
        <title>Your Red Flag Matches | LoveGPT</title>
      </Head>

      <div className="max-w-4xl mx-auto px-6 py-20">
        <h1 className="text-4xl font-bold text-indigo-700 mb-8 text-center">⚠️ Flagged Matches</h1>
        <p className="text-center text-gray-600 mb-6">
          Based on your values and onboarding answers, the following profiles include items that may be a red flag.
        </p>

        {loadingFlags ? (
          <p className="text-center text-gray-500">Loading flagged matches...</p>
        ) : flags.length === 0 ? (
          <p className="text-center text-green-600">No major red flags in your current matches!</p>
        ) : (
          <div className="space-y-6">
            {flags.map((match) => (
              <div key={match.id} className="bg-white shadow-md rounded-xl p-6 border-l-4 border-red-500">
                <h2 className="text-xl font-semibold text-red-600 mb-1">{match.matchName}</h2>
                <p className="text-sm text-gray-600 mb-2">
                  <strong>Reason flagged:</strong> {match.reason}
                </p>
                <p className="text-sm text-gray-500">
                  <strong>Flagged Trait:</strong> {match.trait}
                </p>
                <p className="text-xs text-gray-400 mt-2">
                  Flagged on: {new Date(match.timestamp?.toDate()).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
