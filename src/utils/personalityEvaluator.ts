// src/utils/personalityEvaluator.ts

interface BigFiveScores {
  openness: number;
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;
}

interface CoreValueScores {
  innovation: number;
  love: number;
  independence: number;
  legacy: number;
}

interface EnneagramResult {
  primaryType: number;
  wing: number;
  growthPath: string;
}

interface ReadinessResult {
  commitmentLevel: 'Red' | 'Yellow' | 'Green';
  maturityScore: number;
}

interface PersonalitySummary {
  mbti: string;
  big5: BigFiveScores;
  values: CoreValueScores;
  enneagram: EnneagramResult;
  relationship: ReadinessResult;
  mood: string;
}

interface PersonalityResult {
  summary: PersonalitySummary;
  tags: string[];
  confidenceScore: number;
  lastUpdated: string;
}

export const evaluatePersonalityProfile = (answers: any): PersonalityResult => {
  const mbti = calculateMBTI(answers.mbti || []);
  const big5 = calculateBigFive(answers.big5 || []);
  const values = calculateCoreValues(answers.cvi || []);
  const enneagram = calculateEnneagram(answers.enneagram || []);
  const relationship = calculateReadiness(answers.relationship || []);
  const nlpMood = analyzeTone(answers.chatHistory || []);

  const personalityTags = generateTags({ mbti, big5, enneagram, relationship });
  const confidenceScore = calculateConfidence(answers);

  return {
    summary: {
      mbti,
      big5,
      values,
      enneagram,
      relationship,
      mood: nlpMood,
    },
    tags: personalityTags,
    confidenceScore,
    lastUpdated: new Date().toISOString(),
  };
};

// --- Sub-functions ---

const calculateMBTI = (responses: string[]): string => {
  // TODO: Replace with actual logic
  return "INFP";
};

const calculateBigFive = (responses: any[]): BigFiveScores => {
  return {
    openness: 76,
    conscientiousness: 58,
    extraversion: 42,
    agreeableness: 88,
    neuroticism: 32
  };
};

const calculateCoreValues = (responses: any[]): CoreValueScores => {
  return {
    innovation: 80,
    love: 95,
    independence: 60,
    legacy: 72
  };
};

const calculateEnneagram = (responses: any[]): EnneagramResult => {
  return {
    primaryType: 4,
    wing: 5,
    growthPath: "1"
  };
};

const calculateReadiness = (answers: any[]): ReadinessResult => {
  return {
    commitmentLevel: "Green",
    maturityScore: 78
  };
};

const analyzeTone = (chatLogs: string[]): string => {
  return "Calm + Optimistic";
};

const generateTags = ({
  mbti,
  big5,
  enneagram,
  relationship,
}: {
  mbti: string;
  big5: BigFiveScores;
  enneagram: EnneagramResult;
  relationship: ReadinessResult;
}): string[] => {
  const tags: string[] = [];

  if (mbti === "INFP") tags.push("Idealist");
  if (big5.agreeableness > 80) tags.push("Empath");
  if (relationship.commitmentLevel === "Green") tags.push("Ready for Love");

  return tags;
};

const calculateConfidence = (answers: Record<string, any>): number => {
  const totalAnswered = Object.values(answers)
    .flat()
    .filter(Boolean).length;

  const totalAvailable = 400; // Update as your question pool grows
  return Math.round((totalAnswered / totalAvailable) * 100);
};
