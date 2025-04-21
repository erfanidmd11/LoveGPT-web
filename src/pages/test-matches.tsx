import React from 'react';
import MatchList from '@/components/match/MatchList';
import { DealBreaker } from '@/types';

const mockDealBreakers: DealBreaker[] = [
  { value: 'Smoking', severity: 'hard' },
  { value: 'No desire for kids', severity: 'hard' },
];

export default function TestMatchesPage() {
  const userProfile = {
    dealBreakers: mockDealBreakers,
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-pink-600 mb-6">🧪 MatchList Test</h1>
      <MatchList userProfile={userProfile} />
    </div>
  );
}
