// matchReadiness.ts

/**
 * Calculates a user's dynamic readiness score based on multiple weighted inputs.
 * Used in Super Admin backend for insight, override, and audit.
 */

type ReadinessInputs = {
  onboarding?: number;
  psychometrics?: number;
  ariaInsights?: number;
  engagement?: number;
};

type ReadinessProfile = {
  score: number;
  stage: string;
  insightSummary: string;
  sourceContributions: {
    onboarding?: number;
    psychometrics?: number;
    ariaInsights?: number;
    engagement?: number;
  };
  lastUpdated: string;
};

const WEIGHTS: Record<keyof ReadinessInputs, number> = {
  onboarding: 0.4,
  psychometrics: 0.2,
  ariaInsights: 0.2,
  engagement: 0.2,
};

export function calculateReadinessScore(inputs: ReadinessInputs): ReadinessProfile {
  const { onboarding = 0, psychometrics = 0, ariaInsights = 0, engagement = 0 } = inputs;

  const rawScore = (
    onboarding * WEIGHTS.onboarding +
    psychometrics * WEIGHTS.psychometrics +
    ariaInsights * WEIGHTS.ariaInsights +
    engagement * WEIGHTS.engagement
  );

  const score = parseFloat(rawScore.toFixed(1));
  const stage = mapScoreToStage(score);
  const insightSummary = getInsightSummary(stage);

  return {
    score,
    stage,
    insightSummary,
    sourceContributions: {
      onboarding,
      psychometrics,
      ariaInsights,
      engagement,
    },
    lastUpdated: new Date().toISOString(),
  };
}

export function calculateAge(dob: string): number {
  // Expected dob format: MM/DD/YYYY
  const [month, day, year] = dob.split("/").map(Number);
  const birthDate = new Date(year, month - 1, day);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();

  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}

function mapScoreToStage(score: number): string {
  if (score < 50) return "Self Discovery";
  if (score < 75) return "Open to Casual Dating";
  if (score < 90) return "Ready for Monogamous Relationship";
  if (score < 95) return "Ready for Marriage";
  return "Ready for Parenthood";
}

function getInsightSummary(stage: string): string {
  const summaries: Record<string, string> = {
    "Self Discovery":
      "You're still exploring who you are. Focus on self-awareness and emotional clarity.",
    "Open to Casual Dating":
      "You're emotionally available for light connections. Use this time to observe your patterns.",
    "Ready for Monogamous Relationship":
      "You're grounded and capable of investing in a deep, meaningful bond.",
    "Ready for Marriage":
      "You're emotionally clear and looking for lasting partnership built on trust.",
    "Ready for Parenthood":
      "You're secure, mature, and ready to co-create life and legacy with another.",
  };

  return summaries[stage];
}
