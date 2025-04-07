// src/components/onboarding/Step25ReviewSubmit.js
import React, { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { calculateMatchReadiness } from '@/lib/matchReadiness';
import ProgressBar from '@/components/common/ProgressBar';
import NavigationButtons from '@/components/common/NavigationButtons';


export default function Step25ReviewSubmit({ onNext, onBack }) {
  const [user] = useAuthState(auth);
  const [formData, setFormData] = useState({});
  const [showConfetti, setShowConfetti] = useState(false);
  const [loading, setLoading] = useState(false);
  const { width, height } = useWindowSize();

  useEffect(() => {
    const keys = Object.keys(localStorage).filter(key => key !== 'onboardingStep');
    const data = {};
    keys.forEach(key => {
      try {
        const value = localStorage.getItem(key);
        data[key] = JSON.parse(value);
      } catch {
        data[key] = localStorage.getItem(key);
      }
    });
    setFormData(data);
  }, []);

  const calculateCompletionPercent = (data) => {
    const totalKeys = [
      'onboardingName', 'userDOB', 'onboardingGender', 'onboardingPronouns', 'relationshipGoals',
      'readinessLevel', 'userLocation', 'onboardingCoreValues', 'mbtiThinkingFeeling', 'mbtiExtrovertIntrovert',
      'bfiPlanningPreference', 'nlpOpenness', 'relationshipStatus', 'aiConsent', 'parenthoodReadiness',
      'loveLanguages', 'innerConflictStyle', 'communicationStyle', 'lifestyleNow', 'lifestyleAspire',
      'dealBreakers', 'conflictStyle', 'financialPhilosophy', 'conflictResolution', 'partnershipDynamic',
      'emotionalTriggers', 'conditionedBeliefs', 'readyToReleaseBeliefs', 'opennessLevel'
    ];

    const answered = totalKeys.filter((key) => {
      const value = data[key];
      return Array.isArray(value) ? value.length > 0 : !!value;
    });

    return Math.round((answered.length / totalKeys.length) * 100);
  };

  const getReadinessSummary = (data) => {
    const result = calculateMatchReadiness(data);
    return {
      score: result.score,
      category: result.category,
      AIInsights: result.insights[0] || "You're on a meaningful path. Keep growing and stay open.",
    };
  };

  const structureData = (raw) => {
    const completionPercent = calculateCompletionPercent(raw);
    const { score: readinessScore, category, AIInsights } = getReadinessSummary(raw);

    return {
      profile: {
        fullName: raw.onboardingName,
        dob: raw.userDOB,
        gender: raw.onboardingGender,
        pronouns: raw.onboardingPronouns,
        location: raw.userLocation,
        lookingFor: raw.relationshipGoals || raw.onboardingIntention,
        zodiac: raw.onboardingZodiac,
        relationshipStatus: raw.relationshipStatus,
      },
      personality: {
        personalityTraits: raw.personalityTraits,
        loveLanguages: raw.loveLanguages || [raw.loveLanguage || 'Not specified'],
        conflictStyle: raw.conflictStyle,
        attachmentStyle: raw.attachmentStyle,
        communicationStyle: raw.communicationStyle,
        opennessLevel: raw.opennessLevel,
        innerConflictStyle: raw.innerConflictStyle,
        mbtiThinkingFeeling: raw.mbtiThinkingFeeling,
        mbtiExtrovertIntrovert: raw.mbtiExtrovertIntrovert,
        bfiPlanningPreference: raw.bfiPlanningPreference,
        nlpOpenness: raw.nlpOpenness,
        partnershipDynamic: raw.partnershipDynamic,
      },
      values: {
        financialPhilosophy: raw.financialPhilosophy,
        lifestyleNow: raw.lifestyleNow,
        lifestyleAspire: raw.lifestyleAspire,
        dealBreakers: raw.dealBreakers,
        aiConsent: raw.aiConsent,
        parenthood: raw.parenthoodReadiness,
        religion: raw.religion,
        kidsPlan: raw.kidsPlan,
        careerBalance: raw.careerBalance,
        parentingStyle: raw.parentingStyle,
        politicalView: raw.politicalView,
      },
      readiness: {
        readinessLevel: raw.readinessLevel || raw.onboardingReadiness,
        conditionedBeliefs: raw.conditionedBeliefs,
        readyToReleaseBeliefs: raw.readyToReleaseBeliefs,
        emotionalTriggers: raw.emotionalTriggers,
        score: readinessScore,
        category,
        lastUpdated: serverTimestamp(),
        AIInsights,
        redFlags: [],
      },
      profileCompletion: completionPercent,
      submittedAt: serverTimestamp(),
    };
  };

  const handleSubmit = async () => {
    if (!user) return alert("⚠️ You must be logged in to submit.");
    setLoading(true);

    const userRef = doc(db, 'users', user.uid);
    const structuredData = structureData(formData);

    try {
      await setDoc(userRef, structuredData, { merge: true });

      localStorage.clear();
      setShowConfetti(true);
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 2000);
    } catch (err) {
      console.error("🔥 Error saving profile:", err);
      alert("Something went wrong. Try again.");
      setLoading(false);
    }
  };

  const readiness = getReadinessSummary(formData);

  return (
    <div className="text-center space-y-6">
      <ProgressBar step={25} totalSteps={25} />

      {showConfetti && (
        <Confetti width={width} height={height} recycle={false} numberOfPieces={300} />
      )}

      <h2 className="text-2xl font-bold text-pink-600">🎉 You're Almost Done!</h2>
      <p className="text-gray-600 max-w-xl mx-auto">
        Here’s a quick summary of your profile. You can edit later from your dashboard.
      </p>

      <p className="text-green-600 font-medium">
        ✅ Profile Completion: {calculateCompletionPercent(formData)}%
      </p>

      <p className="text-blue-600 font-medium">
        💡 Match Readiness Score: {readiness.score}/100 ({readiness.category})
      </p>

      <div className="text-left bg-gray-50 rounded-xl p-4 max-h-[300px] overflow-y-scroll border">
        {Object.entries(formData).map(([key, value]) => (
          <div key={key} className="mb-2 border-b pb-2">
            <span className="font-semibold capitalize">{key.replace(/([A-Z])/g, ' $1')}:</span>{' '}
            <span className="text-pink-700">
              {typeof value === 'string' ? value : JSON.stringify(value)}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-4 p-4 bg-white border border-gray-200 rounded-xl text-left">
        <h3 className="font-semibold text-pink-600">🔍 ARIA’s Early Insight:</h3>
        <p className="text-gray-700 mt-2">{readiness.AIInsights}</p>
      </div>

      <NavigationButtons
        onBack={onBack}
        onNext={handleSubmit}
        loading={loading}
        disabledNext={false}
        nextLabel="Submit My Profile"
      />
    </div>
  );
}
  ]
}
