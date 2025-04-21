import Head from 'next/head';
import DashboardLayout from '@/layouts/DashboardLayout';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/lib/firebase';
import { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';

export default function ReferralDashboard() {
  const [user, loading] = useAuthState(auth);
  const [referrals, setReferrals] = useState<any[]>([]);
  const [totalCoins, setTotalCoins] = useState(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (user) fetchReferrals();
  }, [user]);

  const fetchReferrals = async () => {
    const q = query(collection(db, 'inviteApplications'), where('referredBy', '==', user?.uid));
    const snapshot = await getDocs(q);
    const list = snapshot.docs.map(doc => doc.data());
    setReferrals(list);

    const coinsEarned = list.reduce((sum, r) => sum + (r.level || 1) * 10, 0); // 10 coins per level
    setTotalCoins(coinsEarned);
  };

  const referralLink = `${typeof window !== 'undefined' ? window.location.origin : ''}/?ref=${user?.uid}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      alert('Failed to copy link');
    }
  };

  if (loading || !user) return null;

  return (
    <DashboardLayout>
      <Head>
        <title>My Referrals | LoveGPT</title>
      </Head>

      <div className="max-w-4xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold text-indigo-700 mb-6">📣 Your Referrals</h1>

        <p className="text-lg text-gray-600 mb-2">
          You’ve referred <strong>{referrals.length}</strong> member{referrals.length !== 1 ? 's' : ''} and earned a total of{' '}
          <span className="text-pink-600 font-bold">{totalCoins}</span> Love Coins 💖
        </p>

        <div className="bg-white border p-4 rounded-xl mb-6">
          <p className="text-sm text-gray-700 mb-2">Your personal invite link:</p>
          <div className="flex gap-2">
            <input
              type="text"
              value={referralLink}
              readOnly
              className="flex-1 border px-3 py-2 rounded text-sm"
            />
            <button
              onClick={copyToClipboard}
              className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 text-sm rounded"
            >
              {copied ? 'Copied!' : 'Copy Link'}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-2">
            You earn Love Coins for each signup, up to 5 levels deep: 10, 7, 5, 3, 2 per level.
          </p>
        </div>

        {referrals.length === 0 ? (
          <p className="text-gray-500">No referrals yet. Invite someone today!</p>
        ) : (
          <div className="grid gap-4">
            {referrals.map((ref, i) => (
              <div key={i} className="bg-white shadow rounded-xl p-4 border-l-4 border-pink-500">
                <h3 className="text-lg font-semibold text-pink-600">{ref.firstName} {ref.lastName}</h3>
                <p className="text-sm text-gray-600">Level: {ref.level || 1}</p>
                <p className="text-sm text-gray-600">Email: {ref.email}</p>
                <p className="text-sm text-gray-500 mt-1">
                  Match Intent: {ref.isMatchIntent ? 'Yes' : 'No'}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
