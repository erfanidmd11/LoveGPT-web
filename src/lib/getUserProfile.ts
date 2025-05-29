interface UserProfile {
  name: string;
  age: number | 'Unknown';
  location: string;
  zodiacSign: string;
  personalityTraits: string[];
  relationshipGoals: string;
  communicationStyle: string;
  loveLanguage: string;
  attachmentStyle: string;
  onboardingProgress: number;
  matchReadinessScore: number;
}

export function getUserProfile(): UserProfile | null {
  if (typeof window === 'undefined') return null;

  const getItem = (key: string) => localStorage.getItem(key) || '';
  const getNumber = (key: string) => parseInt(localStorage.getItem(key) || '0', 10);

  return {
    name: getItem('userName') || 'User',
    age: calculateAge(getItem('userDOB')),
    location: getItem('userLocation') || 'Unknown',
    zodiacSign: getItem('onboardingZodiac') || 'Not specified',
    personalityTraits: JSON.parse(getItem('personalityTraits') || '[]'),
    relationshipGoals: getItem('relationshipGoals') || 'Not specified',
    communicationStyle: getItem('communicationStyle') || 'Not specified',
    loveLanguage: getItem('loveLanguage') || 'Not specified',
    attachmentStyle: getItem('attachmentStyle') || 'Not specified',
    onboardingProgress: getNumber('onboardingProgress'),
    matchReadinessScore: getNumber('matchReadinessScore'),
  };
}

function calculateAge(dob: string): number | 'Unknown' {
  if (!dob) return 'Unknown';
  const birthDate = new Date(dob);
  if (isNaN(birthDate.getTime())) return 'Unknown';

  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age;
}
