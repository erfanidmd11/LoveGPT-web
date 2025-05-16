export const calculateCompletionPercent = (formData: Record<string, any>): number => {
  const answered = Object.values(formData).filter((val) =>
    Array.isArray(val) ? val.length > 0 : Boolean(val)
  );
  return Math.round((answered.length / Object.keys(formData).length) * 100);
};

export const calculateMatchReadiness = (formData: Record<string, any>) => {
  const score = Math.min(
    100,
    calculateCompletionPercent(formData) + Math.floor(Math.random() * 10)
  );
  const category = score > 90 ? 'Excellent' : score > 70 ? 'Good' : 'Getting There';
  const insights = [`You're currently scoring ${score}, which reflects a ${category} readiness.`];

  return { score, category, insights };
};

export const getReadinessSummary = (formData: Record<string, any>) => {
  const result = calculateMatchReadiness(formData);
  return {
    score: result.score,
    category: result.category,
    AIInsights: result.insights[0],
  };
};
