type MatchReadinessAnswers = {
  relationshipGoals?: string;
  readinessLevel?: 'green' | 'yellow' | 'red';
  aiConsent?: boolean;
  dealBreakers?: string[];
  onboardingCoreValues?: string[];
  communicationStyle?: string;
  innerConflictStyle?: string;
  parenthoodReadiness?: string;
  [key: string]: any;
};

type MatchReadinessResult = {
  score: number;
  category: string;
  insights: string[];
};

export function calculateMatchReadiness(answers: MatchReadinessAnswers): MatchReadinessResult {
  let score = 0;
  const insights: string[] = [];

  // 1. Completion
  const stepsCompleted = Object.keys(answers).length;
  if (stepsCompleted >= 24) {
    score += 20;
  } else {
    insights.push("Try completing all 24 onboarding steps to boost your readiness.");
  }

  // 2. Relationship Intention
  if (answers.relationshipGoals) {
    score += 10;
  } else {
    insights.push("Define what you're looking for — clarity attracts alignment.");
  }

  // 3. Emotional Readiness
  if (answers.readinessLevel === 'green') {
    score += 15;
  } else if (answers.readinessLevel === 'yellow') {
    score += 8;
    insights.push("You're open — but cautious. Growth comes with clarity.");
  } else if (answers.readinessLevel === 'red') {
    score += 3;
    insights.push("Uncertainty is okay. Be honest with yourself as you grow.");
  }

  // 4. AI Consent
  if (answers.aiConsent === true) {
    score += 5;
  }

  // 5. Deal Breakers
  if (Array.isArray(answers.dealBreakers) && answers.dealBreakers.length > 0) {
    score += 10;
  } else {
    insights.push("Clearly stating deal breakers prevents misalignment later.");
  }

  // 6. Core Values
  if (Array.isArray(answers.onboardingCoreValues) && answers.onboardingCoreValues.length > 0) {
    score += 15;
  } else {
    insights.push("Core values are the compass to long-term compatibility.");
  }

  // 7. Communication Style
  if (answers.communicationStyle) {
    score += 10;
  }

  // 8. Inner Conflict Self-Awareness
  if (answers.innerConflictStyle) {
    score += 10;
  }

  // 9. Parenthood
  if (answers.parenthoodReadiness && answers.parenthoodReadiness !== 'skipped') {
    score += 5;
  }

  // Category assignment
  let category = '';
  if (score >= 90) category = 'Ready for Deep Love';
  else if (score >= 70) category = 'Emotionally Available';
  else if (score >= 50) category = 'Open but Healing';
  else category = 'Still Discovering';

  return {
    score,
    category,
    insights,
  };
}
