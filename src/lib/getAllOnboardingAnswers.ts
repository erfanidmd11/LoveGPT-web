type OnboardingAnswers = {
  [key: string]: string | string[]; // You can strongly type each field if needed
};

export const getAllAnswers = (): OnboardingAnswers => {
  return {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    onboardingGender: 'Male',
    userDOB: '1990-01-01',
    userLocation: 'New York, NY',
    relationshipStatus: 'Single',
    relationshipGoals: 'Long-term commitment',
    lifestyleAspire: 'Adventurous and active lifestyle',
    dealBreakers: ['Smoking', 'Dishonesty'],
    loveLanguages: ['Quality time', 'Words of affirmation'],
    lifestyleNow: 'Balanced lifestyle with work and play',
    onboardingZodiac: 'Leo',
    aiToneStyle: 'Friendly',
    readyToReleaseBeliefs: 'Open-minded',
    bfiPlanningPreference: 'Strategic',
    mbtiExtrovertIntrovert: 'Extroverted',
    parenthoodCue: 'Ready to start a family',
    communicationStyle: 'Direct and honest',
    partnershipDynamic: 'Equal partnership',
    innerConflictStyle: 'Calm and solution-focused',
    onboardingCoreValues: ['Family', 'Trust', 'Growth'],
    conditionedBeliefs: ['Money equals success', 'Hard work leads to happiness'],
    emotionalTriggers: ['Disrespect', 'Injustice'],
    nlpOpenness: 'High',
    triggerNurturing: 'Loves nurturing',
    readinessLevel: 'High',
    opennessLevel: 'Very open',
    mbtiThinkingFeeling: 'Feeling',
    conflictStyle: 'Collaborative',
    conflictResolution: 'Compromise',
    financialPhilosophy: 'Save and invest',
    matchStrategy: 'Focused on values compatibility',
    parenthoodReadiness: 'Yes, ready to become a parent',
    aiConsent: 'Fully consent to using AI for relationship insights',
  };
};
