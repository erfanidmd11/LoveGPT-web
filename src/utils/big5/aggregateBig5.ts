// src/utils/big5/aggregateBig5.ts

type Big5Answers = Record<string, string>;

export const getBig5ResultFromAnswers = (answers: Big5Answers): Record<string, number> => {
  // Big Five Personality Dimensions:
  // Openness, Conscientiousness, Extraversion, Agreeableness, Neuroticism
  let traits = {
    Openness: 0,
    Conscientiousness: 0,
    Extraversion: 0,
    Agreeableness: 0,
    Neuroticism: 0,
  };

  // Define the mapping for Big Five questions
  const traitMap: Record<string, keyof typeof traits> = {
    big5_1: 'Extraversion', big5_5: 'Openness', big5_9: 'Openness',
    big5_13: 'Openness', big5_17: 'Extraversion', big5_21: 'Openness',
    big5_25: 'Extraversion', big5_29: 'Extraversion', big5_33: 'Openness',
    big5_37: 'Extraversion',
    big5_2: 'Agreeableness', big5_6: 'Agreeableness', big5_10: 'Agreeableness',
    big5_14: 'Agreeableness', big5_18: 'Agreeableness', big5_22: 'Agreeableness',
    big5_26: 'Agreeableness', big5_30: 'Agreeableness', big5_34: 'Agreeableness',
    big5_38: 'Agreeableness',
    big5_3: 'Conscientiousness', big5_7: 'Conscientiousness', big5_11: 'Conscientiousness',
    big5_15: 'Conscientiousness', big5_19: 'Conscientiousness', big5_23: 'Conscientiousness',
    big5_27: 'Conscientiousness', big5_31: 'Conscientiousness', big5_35: 'Conscientiousness',
    big5_39: 'Conscientiousness',
    big5_4: 'Neuroticism', big5_8: 'Neuroticism', big5_12: 'Neuroticism',
    big5_16: 'Neuroticism', big5_20: 'Neuroticism', big5_24: 'Neuroticism',
    big5_28: 'Neuroticism', big5_32: 'Neuroticism', big5_36: 'Neuroticism',
    big5_40: 'Neuroticism',
  };

  const weights: Record<string, number> = {
    'Strongly Disagree': 1,
    'Disagree': 2,
    'Neutral': 3,
    'Agree': 4,
    'Strongly Agree': 5,
  };

  // Aggregate answers based on the mapping
  Object.keys(answers).forEach((qid) => {
    const trait = traitMap[qid];
    const answer = answers[qid];
    if (trait && weights[answer] !== undefined) {
      traits[trait] += weights[answer];
    }
  });

  return traits;
};
