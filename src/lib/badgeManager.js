// lib/badgeManager.js

export function getBadges(userData) {
    const badges = [];
  
    if (userData.profileCompletion === 100) {
      badges.push({ label: "Complete Onboarding", emoji: "🏁" });
    }
  
    if (userData.readiness?.score >= 80) {
      badges.push({ label: "Match Ready", emoji: "💯" });
    }
  
    if (userData.aiConsent) {
      badges.push({ label: "AI Explorer", emoji: "🤖" });
    }
  
    if (userData.parenthoodReadiness === 'yes') {
      badges.push({ label: "Nurturer", emoji: "👶" });
    }
  
    return badges;
  }
  