import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import zodiacProfiles from '@/lib/zodiacProfiles';
import MatchReadinessWidget from '@/components/dashboard/MatchReadinessWidget';
import GamifiedProfileWidget from '@/components/dashboard/GamifiedProfileWidget';
import ReferralLeaderboard from '@/components/dashboard/ReferralLeaderboard';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/router';
import LoginModal from '@/components/common/LoginModal';
import LoadingButton from '@/components/common/LoadingButton';

export default function Dashboard() {
  const [user] = useAuthState(auth);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [zodiac, setZodiac] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('Love Seeker');
  const [resumeScore, setResumeScore] = useState<number>(82); // placeholder
  const [readiness, setReadiness] = useState<'Green' | 'Yellow' | 'Red'>('Green'); // placeholder
  const router = useRouter();

  useEffect(() => {
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    const onboardingStep = localStorage.getItem('onboardingStep');
    if (onboardingStep && onboardingStep !== '25') {
      router.push(`/onboarding/step${onboardingStep}`);
    } else {
      setZodiac(localStorage.getItem('onboardingZodiac'));
      setUserName(localStorage.getItem('firstName') || 'Love Seeker');
    }
  }, [user, router]);

  const zodiacData = zodiac ? zodiacProfiles[zodiac] : null;

  return (
    <>
      <Head>
        <title>Dashboard | LoveGPT</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
          <div className="bg-white shadow-md rounded-xl p-6 text-center">
            <h1 className="text-2xl font-bold text-gray-800">Hi {userName}! 👋</h1>
            <p className="text-sm text-gray-500 mt-1">Here's where your journey continues...</p>
          </div>

          <div className="bg-white shadow rounded-xl p-5">
            <MatchReadinessWidget />
          </div>

          <div className="bg-white shadow rounded-xl p-5">
            <GamifiedProfileWidget />
          </div>

          <div className="bg-white shadow rounded-xl p-5">
            <ReferralLeaderboard />
          </div>

          {zodiacData ? (
            <div className="bg-purple-50 p-5 rounded-xl shadow border border-purple-200">
              <h2 className="text-lg font-semibold text-purple-700">♓ Your Zodiac: {zodiac}</h2>
              <p className="text-sm text-gray-700 mt-1">
                Element: <span className="font-medium">{zodiacData.element}</span>
              </p>
              <p className="text-sm mt-2 text-gray-600">
                Key Traits: {zodiacData.femaleTraits.slice(0, 3).join(', ')}
              </p>
              <p className="text-sm text-pink-500 mt-2 italic">
                AI Insight: {zodiacData.aiTips[0]}
              </p>
            </div>
          ) : (
            <div className="bg-white p-4 rounded-xl text-sm text-gray-500 text-center shadow">
              Zodiac not available yet. Complete onboarding to reveal your sign!
            </div>
          )}

          <div className="bg-white shadow rounded-xl p-5">
            <h2 className="text-lg font-bold text-gray-800">📄 Resume Snapshot</h2>
            <p className="text-gray-600 text-sm mt-2">Completion: {resumeScore}%</p>
            <p className="text-sm mt-1 text-gray-500">Readiness Level: {readiness}</p>
            <div className="mt-4 space-x-3">
              <button className="bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded">
                View Full Resume
              </button>
              <button className="text-pink-500 border border-pink-400 px-4 py-2 rounded hover:bg-pink-50">
                Continue Onboarding
              </button>
            </div>
          </div>

          <div className="bg-white shadow rounded-xl p-5">
            <h2 className="text-lg font-bold text-gray-800">💘 Suggested Matches</h2>
            <ul className="mt-3 space-y-3">
              {[
                { name: 'Maya, 30', match: '88%', zodiac: 'Cancer ♋️' },
                { name: 'Lily, 28', match: '92%', zodiac: 'Virgo ♍️' }
              ].map((m, i) => (
                <li key={i} className="flex justify-between text-sm">
                  <div>
                    <p className="font-medium">{m.name}</p>
                    <p className="text-gray-500">Zodiac: {m.zodiac}</p>
                  </div>
                  <span className="text-pink-600 font-semibold">{m.match}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-white shadow rounded-xl p-5">
            <h2 className="text-lg font-bold text-gray-800">🔍 Message Analyzer</h2>
            <p className="text-sm text-gray-500 mb-2">
              Paste a text message or email below and ARIA will provide emotional insights.
            </p>
            <textarea
              placeholder="Paste your message here..."
              className="w-full border border-pink-200 rounded-xl px-4 py-2 min-h-[100px] focus:outline-pink-400"
            />
            <button className="mt-3 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">
              Analyze with ARIA
            </button>
          </div>

          <div className="text-sm text-center text-gray-400 mt-10 italic">
            More AI tools coming soon — voice tone analysis, video calls, partner compare view, and more!
          </div>
        </div>
      </div>

      {/* Show login modal if not authenticated */}
      {showLoginModal && (
        <LoginModal
          onClose={() => setShowLoginModal(false)}
          onSuccess={() => {
            setShowLoginModal(false);
            router.reload();
          }}
        />
      )}

      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.7s ease-in-out both;
        }
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  );
}
