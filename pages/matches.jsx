import React from 'react';
import MatchList from '@/components/match/MatchList';

export default function MatchesPage() {
  const userProfile = {
    name: 'You',
    dealBreakers: [
      { value: 'Smoking 🚬', severity: 'hard' },
      { value: 'Open relationships 🧑‍🤝‍🧑', severity: 'hard' },
      { value: 'No desire for kids ❌👶', severity: 'soft' },
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 px-4 py-10">
      <MatchList userProfile={userProfile} />
    </div>
  );
}
