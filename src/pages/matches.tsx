// src/pages/dashboard/matches.tsx
import React from 'react';
import Head from 'next/head';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import MatchList from '@/components/match/MatchList';
import DashboardLayout from '@/layouts/DashboardLayout';

export default function MatchesPage() {
  const [user, loading] = useAuthState(auth);

  if (loading) return <div className="p-10 text-center text-gray-500">⏳ Loading your matches...</div>;
  if (!user) return <div className="p-10 text-center text-gray-500">🔒 Please log in to view your matches.</div>;

  const userProfile = {
    name: 'You',
    dealBreakers: [
      { value: 'Smoking 🚬', severity: 'hard' },
      { value: 'Open relationships 🧑‍🤝‍🧑', severity: 'hard' },
      { value: 'No desire for kids ❌👶', severity: 'soft' },
    ],
  };

  return (
    <DashboardLayout>
      <Head>
        <title>Your Matches | LoveGPT</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 px-4 py-10">
        <h1 className="text-3xl font-bold text-indigo-700 mb-6 text-center">💞 Suggested Matches</h1>
        <MatchList userProfile={userProfile} />
      </div>
    </DashboardLayout>
  );
}
