// src/utils/disc/aggregateDISC.ts

type DISCAnswers = Record<string, string>;

// src/utils/disc/aggregateDISC.ts

export const getDISCResultFromAnswers = (answers: string[]): string => {
  // DISC Dimensions: Dominance (D), Influence (I), Steadiness (S), Conscientiousness (C)
  let dScore = 0;
  let iScore = 0;
  let sScore = 0;
  let cScore = 0;

  const weightMap: Record<string, number> = {
    'Strongly Disagree': 1,
    'Disagree': 2,
    'Neutral': 3,
    'Agree': 4,
    'Strongly Agree': 5
  };

  const discMap: Record<number, string> = {
    1: 'D', 2: 'D', 3: 'D', 4: 'I', 5: 'I', 6: 'I', 7: 'S', 8: 'S', 9: 'S', 10: 'C', 11: 'C', 12: 'C',
    13: 'D', 14: 'I', 15: 'C', 16: 'I', 17: 'D', 18: 'S', 19: 'I', 20: 'D', 21: 'C', 22: 'D', 23: 'I', 24: 'S'
  };

  // Iterate through the answers array and calculate the scores
  answers.forEach((answer, index) => {
    const type = discMap[index + 1];
    if (type && weightMap[answer] !== undefined) {
      switch (type) {
        case 'D': dScore += weightMap[answer]; break;
        case 'I': iScore += weightMap[answer]; break;
        case 'S': sScore += weightMap[answer]; break;
        case 'C': cScore += weightMap[answer]; break;
        default: break;
      }
    }
  });

  // Determine the highest score
  let result = '';
  if (dScore > iScore && dScore > sScore && dScore > cScore) result = 'D';
  else if (iScore > dScore && iScore > sScore && iScore > cScore) result = 'I';
  else if (sScore > dScore && sScore > iScore && sScore > cScore) result = 'S';
  else if (cScore > dScore && cScore > iScore && cScore > sScore) result = 'C';

  return result;
};
