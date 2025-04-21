import React from 'react';
import { determineZodiacSign, capitalize } from '@/utils/zodiacUtils';
import zodiacData from '@/data/zodiacData.json';

interface UserProfile {
  birthDate: string;
  gender: 'male' | 'female';
}

interface ResumeCardProps {
  userProfile: UserProfile;
}

export default function ResumeCard({ userProfile }: ResumeCardProps) {
  const { birthDate, gender } = userProfile;
  const zodiac = determineZodiacSign(birthDate);
  const zodiacInfo = zodiacData[zodiac];

  const traitList = zodiacInfo?.[`${gender}Traits`] || [];
  const aiTipIndex = gender === 'male' ? 0 : 1;
  const aiTip = zodiacInfo?.ai_tips?.[aiTipIndex] || '';

  if (!zodiacInfo) {
    return (
      <div className="bg-white rounded-xl shadow p-6 text-red-500">
        Unable to determine zodiac data. Please check your birth date.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow p-6 space-y-4">
      <h2 className="text-lg font-bold text-pink-500">♓ Your Zodiac Snapshot</h2>

      <p>
        <strong>Sign:</strong> {capitalize(zodiac)}
      </p>

      <p>
        <strong>Traits ({capitalize(gender)}):</strong> {traitList.join(', ')}
      </p>

      <p>
        <strong>Best Matches:</strong> {zodiacInfo.best_matches.map(capitalize).join(', ')}
      </p>

      <p>
        <strong>Use Caution With:</strong> {zodiacInfo.caution_matches.map(capitalize).join(', ')}
      </p>

      <p className="text-sm italic text-purple-600">
        {aiTip}
      </p>
    </div>
  );
}
