import React, { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { calculateMatchReadiness } from '@/lib/matchReadiness';
import ProgressBar from '@/components/common/ProgressBar';
import NavigationButtons from '@/components/common/NavigationButtons';
import { useRouter } from 'next/router';

interface Step25Props {
  onNext: () => void;
  onBack: () => void;
}

interface FormData {
  [key: string]: any;
}

export default function Step25ReviewSubmit({ onNext, onBack }: Step25Props) {
  const [formData, setFormData] = useState<FormData>({});
  const [showConfetti, setShowConfetti] = useState(false);
  const [loading, setLoading] = useState(false);
  const { width, height } = useWindowSize();
  const router = useRouter();

  useEffect(() => {
    const keys = Object.keys(localStorage).filter((key) => key !== 'onboardingStep');
    const data: FormData = {};

    keys.forEach((key) => {
      try {
        const value = localStorage.getItem(key);
        data[key] = JSON.parse(value!);
      } catch {
        data[key] = localStorage.getItem(key);
      }
    });

    setFormData(data);
  }, []);

  const calculateCompletionPercent = (data: FormData): number => {
    const answered = Object.values(data).filter((val) =>
      Array.isArray(val) ? val.length > 0 : Boolean(val)
    );
    return Math.round((answered.length / Object.keys(data).length) * 100);
  };

  const getReadinessSummary = (data: FormData) => {
    const result = calculateMatchReadiness(data);
    return {
      score: result.score,
      category: result.category,
      AIInsights: result.insights[0] || "You're on a meaningful path. Keep growing and stay open.",
    };
  };

  const handleSubmit = async () => {
    const phoneNumber =
      localStorage.getItem('phoneNumber') || sessionStorage.getItem('lovegpt_user');
    if (!phoneNumber) {
      alert('Missing phone number. Please restart onboarding.');
      router.push('/');
      return;
    }

    setLoading(true);
    const userRef = doc(db, 'users', phoneNumber);
    const completion = calculateCompletionPercent(formData);
    const { score, category, AIInsights } = getReadinessSummary(formData);

    const profileData = {
      formData,
      profileCompletion: completion,
      readinessScore: score,
      readinessCategory: category,
      insights: AIInsights,
      onboardingComplete: true,
      lastUpdated: serverTimestamp(),
    };

    try {
      await setDoc(userRef, profileData, { merge: true });

      localStorage.setItem('onboardingComplete', 'true');
      localStorage.removeItem('onboardingStep');

      setShowConfetti(true);
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);
    } catch (err) {
      console.error('🔥 Error saving profile:', err);
      alert('Something went wrong. Try again.');
      setLoading(false);
    }
  };

  const readiness = getReadinessSummary(formData);

  const displayOrder: [keyof FormData, string][] = [
    ['firstName', 'First Name'],
    ['lastName', 'Last Name'],
    ['phoneNumber', 'Phone Number'],
    ['email', 'Email'],
    ['onboardingGender', 'Gender'],
    ['userDOB', 'Date of Birth'],
    ['userLocation', 'Location'],
    ['relationshipStatus', 'Relationship Status'],
    ['relationshipGoals', 'Relationship Goals'],
    ['lifestyleAspire', 'Lifestyle Aspirations'],
    ['dealBreakers', 'Deal Breakers'],
    ['loveLanguages', 'Love Languages'],
    ['lifestyleNow', 'Current Lifestyle'],
    ['onboardingZodiac', 'Zodiac Sign'],
    ['aiToneStyle', 'AI Tone Style'],
    ['readyToReleaseBeliefs', 'Release Beliefs'],
    ['bfiPlanningPreference', 'Planning Style'],
    ['mbtiExtrovertIntrovert', 'Social Energy'],
    ['parenthoodCue', 'Parenthood Philosophy'],
    ['communicationStyle', 'Communication Style'],
    ['partnershipDynamic', 'Relationship Role Preference'],
    ['innerConflictStyle', 'Inner Conflict Style'],
    ['onboardingCoreValues', 'Core Values'],
    ['conditionedBeliefs', 'Conditioned Beliefs'],
    ['emotionalTriggers', 'Emotional Triggers'],
    ['nlpOpenness', 'Openness'],
    ['triggerNurturing', 'Self-Nurturing Style'],
    ['readinessLevel', 'Readiness Level'],
    ['opennessLevel', 'Transparency Level'],
    ['mbtiThinkingFeeling', 'Decision-Making Style'],
    ['conflictStyle', 'Conflict Style'],
    ['conflictResolution', 'Conflict Resolution'],
    ['financialPhilosophy', 'Financial Philosophy'],
    ['matchStrategy', 'Match Strategy'],
    ['parenthoodReadiness', 'Parenthood Readiness'],
    ['aiConsent', 'AI Consent'],
  ];

  const renderField = (key: string, label: string, value: any) => (
    <div key={key} className="mb-4 border-b pb-3">
      <span className="font-bold text-gray-700 block mb-1">{label}</span>
      <span className="text-pink-700 block text-sm">
        {typeof value === 'string' ? value : JSON.stringify(value)}
      </span>
    </div>
  );

  return (
    <div className="text-center space-y-6">
      <ProgressBar step={25} totalSteps={25} />

      {showConfetti && (
        <Confetti width={width} height={height} recycle={false} numberOfPieces={300} />
      )}

      <h2 className="text-2xl font-bold text-pink-600">🎉 You're Almost Done!</h2>
      <p className="text-gray-600 max-w-xl mx-auto">
        Review your profile below. You can edit everything later from your dashboard.
      </p>

      <p className="text-green-600 font-medium">
        ✅ Profile Completion: {calculateCompletionPercent(formData)}%
      </p>

      <p className="text-blue-600 font-medium">
        💡 Match Readiness Score: {readiness.score}/100 ({readiness.category})
      </p>

      <div className="text-left bg-gray-50 rounded-xl p-4 max-h-[300px] overflow-y-scroll border">
        {displayOrder.map(([key, label]) =>
          formData[key] ? renderField(key, label, formData[key]) : null
        )}
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
