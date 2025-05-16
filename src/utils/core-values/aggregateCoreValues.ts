// src/utils/core-values/aggregateCoreValues.ts

type CoreValuesAnswers = Record<string, string>;

export const getCoreValuesResultFromAnswers = (answers: CoreValuesAnswers): string[] => {
  // Define a set of core values that will be assigned based on answers
  const coreValuesMap: Record<string, string[]> = {
    coreValue_1: ['Integrity', 'Respect'],
    coreValue_2: ['Compassion', 'Empathy'],
    coreValue_3: ['Innovation', 'Creativity'],
    coreValue_4: ['Courage', 'Bravery'],
    coreValue_5: ['Teamwork', 'Collaboration'],
    // Add more as needed
  };

  const selectedCoreValues: string[] = [];

  // Process each answer and match it with the corresponding core value(s)
  Object.keys(answers).forEach((qid) => {
    const selectedValues = coreValuesMap[qid];
    if (selectedValues && answers[qid] === 'Agree') { // Adjust based on how answers are stored (e.g., "Agree", "Disagree")
      selectedCoreValues.push(...selectedValues);
    }
  });

  // Remove duplicates from the selected values
  return [...new Set(selectedCoreValues)];
};
