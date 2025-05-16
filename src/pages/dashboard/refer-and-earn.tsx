import React, { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc, getDocs, collection, query, where } from 'firebase/firestore';
import Head from 'next/head';
import DashboardLayout from '@/layouts/DashboardLayout';  // Correct layout
import Link from 'next/link';
import QRCode from 'react-qr-code'; // Ensure this is installed: npm install react-qr-code

// Import the correct type from Firebase
import { DocumentData } from 'firebase/firestore'; // This imports the Firestore DocumentData type

export default function ResumePage() {
  return (
    <DashboardLayout>
      <div className="p-6 text-center text-gray-500">Page Coming Soon</div>
    </DashboardLayout>
  );
}

export function ReferAndEarnPage() {
  const [user, loading] = useAuthState(auth);
  const [referrals, setReferrals] = useState<DocumentData[]>([]);  // Correctly typed as DocumentData[]
  const [referralCode, setReferralCode] = useState('');

  useEffect(() => {
    if (user) {
      setReferralCode(user.uid);
      fetchReferrals();
    }
  }, [user]);

  const fetchReferrals = async () => {
    const q = query(collection(db, 'inviteApplications'), where('referredBy', '==', user?.uid));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map(doc => doc.data());
    setReferrals(data);
  };

  const referralLink = `${typeof window !== 'undefined' ? window.location.origin : ''}/?ref=${referralCode}`;

  const totalCoins = referrals.reduce((acc, r) => acc + (r.level === 1 ? 10 : r.level === 2 ? 7 : r.level === 3 ? 5 : r.level === 4 ? 3 : r.level === 5 ? 2 : 0), 0);

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
  };

  if (loading || !user) return null;

  return (
    <DashboardLayout>
      <Head>
        <title>Refer & Earn | LoveGPT</title>
      </Head>
      <div className="max-w-5xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-bold text-indigo-700 mb-4">🎁 Refer & Earn</h1>
        <p className="text-gray-600 mb-6 text-lg">Earn Love Coins for inviting your friends and connections to join LoveGPT.</p>

        <div className="bg-white p-6 rounded-xl shadow mb-6">
          <p className="text-sm text-gray-500 mb-2">Your unique referral link:</p>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <input
              type="text"
              readOnly
              value={referralLink}
              className="w-full border px-4 py-2 rounded text-sm"
            />
            <button
              onClick={copyLink}
              className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg text-sm"
            >
              Copy Link
            </button>
          </div>
          <div className="mt-4">
            <QRCode value={referralLink} size={100} />
          </div>
        </div>

        <h2 className="text-2xl font-semibold text-indigo-700 mb-4">📚 Your Referral Tree</h2>

        <div className="bg-white p-4 rounded-xl shadow space-y-4">
          {referrals.length === 0 ? (
            <p className="text-gray-500">You haven’t referred anyone yet. Share your link above to get started!</p>
          ) : (
            referrals.map((ref, i) => (
              <div key={i} className="border-l-4 pl-4 border-pink-500">
                <p className="text-pink-600 font-medium">{ref.level === 1 ? `${ref.firstName} ${ref.lastName}` : `${ref.firstName} (Level ${ref.level})`}</p>
                <p className="text-sm text-gray-600">
                  Earned: <strong>{ref.level === 1 ? '10' : ref.level === 2 ? '7' : ref.level === 3 ? '5' : ref.level === 4 ? '3' : '2'}</strong> Love Coins
                </p>
                {ref.level === 1 && (
                  <p className="text-sm text-gray-500">
                    Intent: {ref.isMatchIntent ? 'Match Evaluation' : 'Friend/Network Referral'}
                  </p>
                )}
              </div>
            ))
          )}
        </div>

        <div className="mt-8 text-sm text-gray-600">
          <h3 className="font-semibold text-indigo-700 mb-2">💡 Referral System Details</h3>
          <ul className="list-disc ml-6 space-y-1">
            <li>You earn 10 Love Coins for direct referrals.</li>
            <li>Indirect referrals earn you 7, 5, 3, and 2 coins (up to 5 levels deep).</li>
            <li>You can refer for either Match Evaluation or as a Friend (choose at signup).</li>
            <li>Only direct referrals show full name and intent (others stay partially anonymous).</li>
          </ul>
        </div>
      </div>
    </DashboardLayout>
  );
}
