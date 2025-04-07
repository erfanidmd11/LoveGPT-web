// lib/pointEngine.js

export const actionPoints = {
    completedStep: 5,
    completedAllOnboarding: 50,
    updatedAnswer: 2,
    invitedFriend: 20,
    consentedToAI: 10,
    definedDealBreakers: 10,
    readinessScoreOver80: 15,
  };
  
  export function calculateUserPoints(userData) {
    let points = 0;
  
    if (userData.profileCompletion >= 100) {
      points += actionPoints.completedAllOnboarding;
    }
  
    if (userData.readiness?.score >= 80) {
      points += actionPoints.readinessScoreOver80;
    }
  
    if (userData.aiConsent === true) {
      points += actionPoints.consentedToAI;
    }
  
    if (Array.isArray(userData.dealBreakers) && userData.dealBreakers.length > 0) {
      points += actionPoints.definedDealBreakers;
    }
  
    // Extend: add more rewardable actions
  
    return points;
  }
  