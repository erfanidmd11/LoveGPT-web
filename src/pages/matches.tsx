// src/pages/dashboard/matches.tsx
import React from 'react';
import Head from 'next/head';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import MatchList from '@/components/match/MatchList';
import DashboardLayout from '@/layouts/DashboardLayout';

interface DealBreaker {
  value: string;
  severity: 'hard' | 'soft'; // 'hard' or 'soft' for severity
}

interface UserProfile {
  name: string;
  dealBreakers: DealBreaker[];
}

export default function MatchesPage() {
  const [user, loading] = useAuthState(auth);

  if (loading) return <div className="p-10 text-center text-gray-500">⏳ Loading your matches...</div>;
  if (!user) return <div className="p-10 text-center text-gray-500">🔒 Please log in to view your matches.</div>;

  // User profile with dealbreakers
  const userProfile: UserProfile = {
    name: 'You',
    dealBreakers: [
      { value: 'Smoking 🚬', severity: 'hard' }, // Severity is 'hard'
      { value: 'Open relationships 🧑‍🤝‍🧑', severity: 'hard' },
      { value: 'No desire for kids ❌👶', severity: 'soft' }, // Severity is 'soft'
    ],
  };

  return (
    <DashboardLayout>
      <Head>
        <title>Your Matches | LoveGPT</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 px-4 py-10">
        <h1 className="text-3xl font-bold text-indigo-700 mb-6 text-center">💞 Suggested Matches</h1>
        <MatchList userProfile={userProfile} /> {/* Pass userProfile to MatchList */}
      </div>
    </DashboardLayout>
  );
}
