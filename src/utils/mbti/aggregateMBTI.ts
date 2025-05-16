// src/utils/mbti/aggregateMBTI.ts

type MBTIAnswers = Record<string, string>;

export const getMBTIResultFromAnswers = (answers: MBTIAnswers): string => {
  // MBTI Dimensions:
  // Introversion (I) vs Extraversion (E)
  // Sensing (S) vs Intuition (N)
  // Thinking (T) vs Feeling (F)
  // Judging (J) vs Perceiving (P)

  let iScore = 0;
  let eScore = 0;
  let sScore = 0;
  let nScore = 0;
  let tScore = 0;
  let fScore = 0;
  let jScore = 0;
  let pScore = 0;

  // Define the MBTI questions and the answers scoring mechanism
  // Each answer will be scored based on the question's dimension

  // For each answer, we will assign scores for the respective dimensions
  Object.keys(answers).forEach((questionId) => {
    const answer = answers[questionId];

    // MBTI questions ID mapping (simplified, you may have actual IDs that map to the correct dimension)
    switch (questionId) {
      case 'q1': // Example for Introversion vs Extraversion
      case 'q2':
      case 'q3':
        if (answer === 'Introversion') {
          iScore += 1;
        } else if (answer === 'Extraversion') {
          eScore += 1;
        }
        break;

      case 'q4': // Example for Sensing vs Intuition
      case 'q5':
        if (answer === 'Sensing') {
          sScore += 1;
        } else if (answer === 'Intuition') {
          nScore += 1;
        }
        break;

      case 'q6': // Example for Thinking vs Feeling
      case 'q7':
        if (answer === 'Thinking') {
          tScore += 1;
        } else if (answer === 'Feeling') {
          fScore += 1;
        }
        break;

      case 'q8': // Example for Judging vs Perceiving
      case 'q9':
        if (answer === 'Judging') {
          jScore += 1;
        } else if (answer === 'Perceiving') {
          pScore += 1;
        }
        break;

      // Add cases for all 24 questions similarly
      default:
        break;
    }
  });

  // Combine the results and determine the MBTI type
  let mbti = '';
  mbti += eScore > iScore ? 'E' : 'I';
  mbti += sScore > nScore ? 'S' : 'N';
  mbti += tScore > fScore ? 'T' : 'F';
  mbti += jScore > pScore ? 'J' : 'P';

  // Return the resulting MBTI type
  return mbti;
};
