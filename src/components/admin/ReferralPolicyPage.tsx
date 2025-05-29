import { useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { SUPER_ADMINS } from '@/config/admins';
import MainLayout from '@/layouts/MainLayout';

const ReferralPolicyPage: React.FC = () => {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    if (!loading && (!user || !SUPER_ADMINS.includes(user.email ?? ''))) {
      router.push('/admin/login');
    }
  }, [user, loading, router]);

  if (loading || !user || !SUPER_ADMINS.includes(user.email ?? '')) return null;

  return (
    <MainLayout>
      <Head>
        <title>Referral System Overview | LoveGPT Admin</title>
      </Head>
      <div className="max-w-4xl mx-auto px-6 py-20">
        <h1 className="text-4xl font-bold text-indigo-700 mb-6">📘 LoveGPT Referral System – Internal Guide</h1>
        <p className="text-gray-700 text-lg mb-6">
          The LoveGPT referral system is a 5-level pyramid-based model designed to reward users who help us grow our value-aligned community.
        </p>
        <h2 className="text-2xl font-semibold text-pink-600 mt-8 mb-3">🔁 Payout Per Referral Level</h2>
        <ul className="list-disc ml-6 text-gray-700 mb-6">
          <li><strong>Level 1:</strong> 10 Love Coins per approved signup</li>
          <li><strong>Level 2:</strong> 7 Love Coins</li>
          <li><strong>Level 3:</strong> 5 Love Coins</li>
          <li><strong>Level 4:</strong> 3 Love Coins</li>
          <li><strong>Level 5:</strong> 2 Love Coins</li>
        </ul>
        <h2 className="text-2xl font-semibold text-pink-600 mt-8 mb-3">❤️ Match Intent Tracking</h2>
        <p className="mb-6 text-gray-700">
          When a user refers someone, they can indicate whether this is someone they want to be considered for compatibility matching.
          If <strong>Match Intent = true</strong>, our AI will initiate ongoing evaluation and track interactions and values across both profiles.
        </p>
        <h2 className="text-2xl font-semibold text-pink-600 mt-8 mb-3">📈 Rewards System & Reporting</h2>
        <p className="mb-6 text-gray-700">
          - Love Coins are virtual and can be used for premium features, matchmaking enhancements, and mentorship access.<br />
          - Admins can audit referrals inside <code>/dashboard/referrals</code> or through Firebase directly.<br />
          - Coins can later be connected to blockchain wallet payouts, credits, or tokens if tokenomics expands.
        </p>
        <h2 className="text-2xl font-semibold text-pink-600 mt-8 mb-3">🛡️ Abuse Prevention & Review</h2>
        <p className="text-gray-700">
          Referrals are reviewed automatically through AI behavior analysis. Suspicious patterns (mass signups, fake data, etc.) will be flagged.
        </p>
      </div>
    </MainLayout>
  );
};

export default ReferralPolicyPage;
