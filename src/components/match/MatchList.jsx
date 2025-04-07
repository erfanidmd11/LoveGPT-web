// src/components/match/MatchList.jsx
import React, { useState, useEffect } from 'react';
import MatchPreviewCard from './MatchPreviewCard.jsx';

export default function MatchList({ userProfile }) {
  const [matches, setMatches] = useState([]);

  useEffect(() => {
    // Replace this with real Firestore logic later
    setMatches([
      {
        id: 'match001',
        name: 'Lena',
        traits: ['Smoking 🚬', 'Open relationships 🧑‍🤝‍🧑'],
        bio: 'Yoga teacher & coffee addict. Looking for something real.',
      },
      {
        id: 'match002',
        name: 'Marcus',
        traits: ['Doesn’t want kids ❌👶', 'Spiritual ✨'],
        bio: 'Gemini. Writer. Backpacker.',
      },
      {
        id: 'match003',
        name: 'Riya',
        traits: ['Monogamous 💍', 'Vegan 🌱'],
        bio: 'Passionate about design, books, and dogs 🐶.',
      },
    ]);
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-pink-600">Your Matches</h2>

      {matches.map((match) => (
        <MatchPreviewCard
          key={match.id}
          userDealBreakers={userProfile.dealBreakers}
          candidate={match}
          onOpenProfile={(candidate) =>
            console.log('👀 Open profile:', candidate)
          }
        />
      ))}
    </div>
  );
}
