// src/utils/nlp/aggregateNLP.ts

export const getNLPResultFromAnswers = (answers: string[]): string => {
  // Define NLP Communication Styles (VAK - Visual, Auditory, Kinesthetic)
  let visualScore = 0;
  let auditoryScore = 0;
  let kinestheticScore = 0;

  // Define the weights for the answers
  const weightMap: Record<string, number> = {
    'Strongly Disagree': 1,
    'Disagree': 2,
    'Neutral': 3,
    'Agree': 4,
    'Strongly Agree': 5,
  };

  // Define the NLP mapping for the questions (simplified example, adjust as needed)
  const nlpMap: Record<number, string[]> = {
    1: ['Visual', 'Auditory'], // Example question, adjust according to your actual questions
    2: ['Kinesthetic'],
    // Add more questions and map them to NLP styles
  };

  // Process answers and assign scores based on the response
  answers.forEach((answer, index) => {
    const styles = nlpMap[index + 1]; // Adjust if your mapping logic needs to start from 1

    if (styles) {
      styles.forEach((style) => {
        if (weightMap[answer] !== undefined) {
          if (style === 'Visual') {
            visualScore += weightMap[answer];
          } else if (style === 'Auditory') {
            auditoryScore += weightMap[answer];
          } else if (style === 'Kinesthetic') {
            kinestheticScore += weightMap[answer];
          }
        }
      });
    }
  });

  // Determine the dominant NLP style based on the highest score
  let result = '';
  if (visualScore > auditoryScore && visualScore > kinestheticScore) result = 'Visual';
  if (auditoryScore > visualScore && auditoryScore > kinestheticScore) result = 'Auditory';
  if (kinestheticScore > visualScore && kinestheticScore > auditoryScore) result = 'Kinesthetic';

  return result;
};
