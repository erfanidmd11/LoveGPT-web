// src/utils/enneagram/aggregateEnneagram.ts

type EnneagramAnswers = Record<string, string>;

export const getEnneagramResultFromAnswers = (answers: EnneagramAnswers): string => {
  // Enneagram Types: 1 to 9
  // Type 1 - The Reformer, Type 2 - The Helper, Type 3 - The Achiever, ..., Type 9 - The Peacemaker
  
  // Initialize scores for each Enneagram type
  const enneagramScores: Record<string, number> = {
    'Type 1': 0,
    'Type 2': 0,
    'Type 3': 0,
    'Type 4': 0,
    'Type 5': 0,
    'Type 6': 0,
    'Type 7': 0,
    'Type 8': 0,
    'Type 9': 0,
  };

  // Define the weight for each answer
  const weightMap: Record<string, number> = {
    'Strongly Disagree': 1,
    'Disagree': 2,
    'Neutral': 3,
    'Agree': 4,
    'Strongly Agree': 5,
  };

  // Enneagram questions mapping (simplified example)
  const enneagramMap: Record<string, string[]> = {
    // Mapping each question ID to its corresponding Enneagram type
    'ennea1': ['Type 1', 'Type 3'], // Example mapping, adjust according to your actual questions
    'ennea2': ['Type 2', 'Type 4'],
    // Continue mapping each question accordingly
  };

  // Process each answer and assign the score to the corresponding Enneagram type
  Object.keys(answers).forEach((questionId) => {
    const answer = answers[questionId];
    const types = enneagramMap[questionId];

    if (types) {
      types.forEach((type) => {
        if (weightMap[answer] !== undefined) {
          enneagramScores[type] += weightMap[answer];
        }
      });
    }
  });

  // Sort the scores to find the dominant Enneagram type
  const sortedScores = Object.entries(enneagramScores)
    .sort((a, b) => b[1] - a[1]);

  return sortedScores[0][0]; // Return the dominant Enneagram type
};
