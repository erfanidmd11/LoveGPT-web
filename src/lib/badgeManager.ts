// ✅ Reusable type for individual badges
export type Badge = {
  label: string;
  emoji: string;
};

// ✅ Optional: Export if you want to use this in multiple files
export type UserData = {
  profileCompletion?: number;
  readiness?: {
    score?: number;
  };
  aiConsent?: boolean;
  parenthoodReadiness?: string;
};

// ✅ Badge logic engine
export function getBadges(userData: UserData): Badge[] {
  const badges: Badge[] = [];

  if (userData.profileCompletion === 100) {
    badges.push({ label: 'Complete Onboarding', emoji: '🏁' });
  }

  if (userData.readiness?.score !== undefined && userData.readiness.score >= 80) {
    badges.push({ label: 'Match Ready', emoji: '💯' });
  }

  if (userData.aiConsent) {
    badges.push({ label: 'AI Explorer', emoji: '🤖' });
  }

  if (userData.parenthoodReadiness === 'yes') {
    badges.push({ label: 'Nurturer', emoji: '👶' });
  }

  return badges;
}
