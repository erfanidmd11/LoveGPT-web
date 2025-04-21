import React from 'react';
import Head from 'next/head';
import zodiacProfiles from '@/lib/zodiacProfiles';

const mockUserA = {
  name: 'You',
  zodiac:
    typeof window !== 'undefined'
      ? localStorage.getItem('onboardingZodiac') || 'Leo'
      : 'Leo',
  personality: 'INFJ',
  values: ['Authenticity', 'Growth', 'Loyalty'],
};

const mockUserB = {
  name: 'Alex',
  zodiac: 'Sagittarius',
  personality: 'ENTP',
  values: ['Adventure', 'Spontaneity', 'Loyalty'],
};

const calculateCompatibility = (
  a: typeof mockUserA,
  b: typeof mockUserB
): { score: number; insights: string[] } => {
  let score = 50;
  const breakdown: string[] = [];

  if (zodiacProfiles[a.zodiac]?.bestMatches.includes(b.zodiac)) {
    score += 20;
    breakdown.push('Zodiac signs are highly compatible 🔮');
  }

  if (a.personality[0] !== b.personality[0]) {
    score += 10;
    breakdown.push('You bring different energies — a growth combo ⚡');
  }

  const shared = a.values.filter((val) => b.values.includes(val));
  if (shared.length) {
    score += shared.length * 10;
    breakdown.push(`Shared values: ${shared.join(', ')} 💖`);
  }

  return {
    score: Math.min(score, 100),
    insights: breakdown,
  };
};

export default function ComparePage() {
  const { score, insights } = calculateCompatibility(mockUserA, mockUserB);

  return (
    <>
      <Head>
        <title>Compare Compatibility | LoveGPT</title>
      </Head>
      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 p-6">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-2xl font-bold text-pink-600 mb-6">
            Compatibility Snapshot 💞
          </h1>

          <div className="grid grid-cols-2 gap-6 text-center mb-6">
            {[mockUserA, mockUserB].map((user, idx) => (
              <div key={idx}>
                <h2 className="font-semibold text-purple-700">{user.name}</h2>
                <p className="text-sm">
                  Zodiac: <strong>{user.zodiac}</strong>
                </p>
                <p className="text-sm">
                  Personality: <strong>{user.personality}</strong>
                </p>
                <p className="text-sm">Values: {user.values.join(', ')}</p>
              </div>
            ))}
          </div>

          <div className="text-center mb-6">
            <h3 className="text-lg font-semibold text-gray-700">Compatibility Score</h3>
            <div className="text-5xl font-bold text-green-600">{score}%</div>
            <p className="text-sm text-gray-500 mt-2">
              Powered by zodiac, personality & core values
            </p>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
            <h4 className="text-md font-semibold text-purple-600 mb-2">
              ARIA’s Insights
            </h4>
            <ul className="list-disc ml-6 text-sm text-gray-700">
              {insights.map((point, i) => (
                <li key={i}>{point}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
