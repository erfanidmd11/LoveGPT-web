// lib/getUserProfile.js

export function getUserProfile() {
    if (typeof window !== 'undefined') {
      const profile = {
        name: localStorage.getItem('userName') || 'User',
        age: calculateAge(localStorage.getItem('userDOB')),
        location: localStorage.getItem('userLocation') || 'Unknown',
        zodiacSign: localStorage.getItem('onboardingZodiac') || 'Not specified',
        personalityTraits: JSON.parse(localStorage.getItem('personalityTraits')) || [],
        relationshipGoals: localStorage.getItem('relationshipGoals') || 'Not specified',
        communicationStyle: localStorage.getItem('communicationStyle') || 'Not specified',
        loveLanguage: localStorage.getItem('loveLanguage') || 'Not specified',
        attachmentStyle: localStorage.getItem('attachmentStyle') || 'Not specified',
        onboardingProgress: parseInt(localStorage.getItem('onboardingProgress'), 10) || 0,
        matchReadinessScore: parseInt(localStorage.getItem('matchReadinessScore'), 10) || 0,
      };
      return profile;
    }
    return null;
  }
  
  function calculateAge(dob) {
    if (!dob) return 'Unknown';
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
  
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
  
    return age;
  }
  