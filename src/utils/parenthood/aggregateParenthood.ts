// src/utils/parenthood/aggregateParenthood.ts

export const getParenthoodResultFromAnswers = (answers: string[]): string => {
  // Define Parenthood Traits
  let emotionalReadinessScore = 0;
  let commitmentReadinessScore = 0;
  let growthReadinessScore = 0;

  // Define the weight for each answer
  const weightMap: Record<string, number> = {
    'Strongly Disagree': 1,
    'Disagree': 2,
    'Neutral': 3,
    'Agree': 4,
    'Strongly Agree': 5,
  };

  // Define a mapping for questions to their traits (simplified, adjust as needed)
  const parenthoodMap: Record<number, string[]> = {
    1: ['EmotionalReadiness', 'CommitmentReadiness'], // Example question mapping
    2: ['EmotionalReadiness', 'GrowthReadiness'],
    // Add more mappings based on your questions
  };

  // Process answers and assign scores based on the response
  answers.forEach((answer, index) => {
    const styles = parenthoodMap[index + 1]; // Adjust if your mapping logic needs to start from 1

    if (styles) {
      styles.forEach((style) => {
        if (weightMap[answer] !== undefined) {
          if (style === 'EmotionalReadiness') {
            emotionalReadinessScore += weightMap[answer];
          } else if (style === 'CommitmentReadiness') {
            commitmentReadinessScore += weightMap[answer];
          } else if (style === 'GrowthReadiness') {
            growthReadinessScore += weightMap[answer];
          }
        }
      });
    }
  });

  // Determine which trait has the highest score
  let result = '';
  if (emotionalReadinessScore > commitmentReadinessScore && emotionalReadinessScore > growthReadinessScore) {
    result = 'Emotional Readiness';
  } else if (commitmentReadinessScore > emotionalReadinessScore && commitmentReadinessScore > growthReadinessScore) {
    result = 'Commitment Readiness';
  } else if (growthReadinessScore > emotionalReadinessScore && growthReadinessScore > commitmentReadinessScore) {
    result = 'Growth Readiness';
  }

  return result; // Return the dominant relationship readiness trait
};
