import { determineZodiacSign, capitalize } from '../utils/zodiacUtils';
import zodiacData from '../data/zodiacData.json';

const ResumeCard = ({ userProfile }) => {
  const { birthDate, gender } = userProfile;
  const zodiac = determineZodiacSign(birthDate);
  const zodiacInfo = zodiacData[zodiac];

  return (
    <div className="bg-white rounded-xl shadow p-6 space-y-4">
      <h2 className="text-lg font-bold text-pink-500">Your Zodiac Insights</h2>
      <p><strong>Sign:</strong> {zodiacInfo.symbol} {capitalize(zodiac)}</p>
      <p><strong>Traits ({capitalize(gender)}):</strong> {zodiacInfo.traits[gender]}</p>
      <p><strong>Best Matches:</strong> {zodiacInfo.best_matches.map(capitalize).join(', ')}</p>
      <p><strong>Use Caution With:</strong> {zodiacInfo.caution_matches.map(capitalize).join(', ')}</p>
      <p className="text-sm italic text-gray-600">{zodiacInfo.compatibility_notes}</p>
    </div>
  );
};
