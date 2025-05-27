// Dynamic user badge logic
export type Badge = {
  label: string;
  emoji: string;
};

export type UserData = {
  profileCompletion?: number;
  readiness?: {
    score?: number;
  };
  aiConsent?: boolean;
  parenthoodReadiness?: string;
};

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

// Static badge images (for referral tiers)
export const badgeImageMap: Record<string, string> = {
  'Seed Planter': '/seed-planter.png',
  'Spark Spreader': '/spark-spreader.png',
  "Cupid's Assistant": '/cupids-assistant.png',
  'Matchmaker Elite': '/matchmaker-elite.png',
  'LoveGPT Luminary': '/lovegpt-luminary.png',
};
