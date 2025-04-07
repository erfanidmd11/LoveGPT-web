// pages/resume.js
import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import zodiacProfiles from '@/lib/zodiacProfiles';
import Image from 'next/image';

export default function ResumePage() {
  const [zodiac, setZodiac] = useState(null);
  const [userName, setUserName] = useState('');
  const [audioReady, setAudioReady] = useState(false);
  const [audioURL, setAudioURL] = useState(null);
  const [profileMedia, setProfileMedia] = useState([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setZodiac(localStorage.getItem('onboardingZodiac'));
      setUserName(localStorage.getItem('onboardingName') || 'You');
      setAudioReady(true);
      setAudioURL('/audio/sample-summary.mp3'); // You can dynamically generate later
    }
  }, []);

  const zodiacData = zodiacProfiles[zodiac];

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = files.map((file) => URL.createObjectURL(file));
    setProfileMedia([...profileMedia, ...newFiles]);
  };

  const removeMedia = (indexToRemove) => {
    setProfileMedia((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  return (
    <>
      <Head>
        <title>{userName}'s LoveGPT Resume</title>
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 p-6">
        <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-2xl p-6 space-y-8 transition-all duration-300">

          {/* Header */}
          <div className="flex items-center gap-3">
            <Image
              src="/aria-avatar.png"
              alt="ARIA"
              width={48}
              height={48}
              className="rounded-full"
            />
            <div>
              <h1 className="text-2xl font-bold text-pink-600">{userName}'s LoveGPT Resume 💖</h1>
              <p className="text-sm text-gray-500">Curated by ARIA — your emotional AI mirror 🌸</p>
            </div>
          </div>

          {/* Profile Media */}
          <section>
            <h2 className="text-lg font-semibold text-pink-600 mb-2">📸 Profile Media</h2>
            <p className="text-sm text-gray-500 mb-4">Upload images or a profile video (optional)</p>
            <input
              type="file"
              accept="image/*,video/*"
              onChange={handleFileUpload}
              multiple
              className="mb-4"
            />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {profileMedia.map((url, i) => (
                <div key={i} className="relative group">
                  {url.includes('video') ? (
                    <video src={url} controls className="w-full h-32 rounded-xl" />
                  ) : (
                    <img src={url} alt={`media-${i}`} className="rounded-xl w-full h-32 object-cover" />
                  )}
                  <button
                    onClick={() => removeMedia(i)}
                    className="absolute top-1 right-1 bg-white text-red-500 text-xs px-2 py-1 rounded opacity-80 hover:opacity-100"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </section>

          {/* Zodiac Summary */}
          {zodiacData && (
            <section className="bg-purple-50 border border-purple-300 rounded-xl p-4">
              <h2 className="text-lg font-semibold text-purple-700">♓ Zodiac Snapshot: {zodiac}</h2>
              <p className="text-sm text-gray-600 mt-1">Element: {zodiacData.element}</p>
              <p className="text-sm text-gray-700 mt-1">
                Key Traits: {zodiacData.femaleTraits.join(', ')}
              </p>
              <p className="text-sm text-purple-500 mt-2 italic">“{zodiacData.aiTips[0]}”</p>
            </section>
          )}

          {/* Compatibility Score */}
          <section className="bg-green-50 border border-green-300 rounded-xl p-4">
            <h2 className="text-lg font-semibold text-green-700">💞 Compatibility Readiness Score</h2>
            <p className="text-sm text-gray-700 mt-1">
              Based on your current answers, ARIA estimates your emotional compatibility readiness at:
            </p>
            <div className="mt-4 text-4xl font-bold text-green-600">87%</div>
            <p className="text-xs text-gray-500 mt-1">Keep answering values/personality questions to refine this score.</p>
          </section>

          {/* Audio Summary */}
          <section className="bg-pink-100 border border-pink-300 rounded-xl p-4">
            <h2 className="text-lg font-semibold text-pink-700">🎧 ARIA’s Audio Summary</h2>
            {audioReady ? (
              <audio controls className="mt-2 w-full">
                <source src={audioURL} type="audio/mpeg" />
                Your browser does not support audio playback.
              </audio>
            ) : (
              <p className="text-sm text-gray-500 italic">ARIA is preparing your audio... sit tight 💫</p>
            )}
          </section>

          {/* Core Values */}
          <section className="bg-blue-50 border border-blue-300 rounded-xl p-4">
            <h2 className="text-lg font-semibold text-blue-700">🌱 Core Values Snapshot</h2>
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm text-gray-700">
              {[
                { name: 'Authenticity', score: 92 },
                { name: 'Growth', score: 89 },
                { name: 'Loyalty', score: 94 },
                { name: 'Playfulness', score: 78 },
                { name: 'Compassion', score: 85 },
              ].map(({ name, score }) => (
                <div key={name} className="flex items-center justify-between">
                  <span>{name}</span>
                  <span className="bg-blue-500 text-white px-2 py-0.5 rounded text-xs">{score}%</span>
                </div>
              ))}
            </div>
          </section>

          {/* Navigation Buttons */}
          <div className="text-center mt-8">
            <p className="text-sm text-gray-500 mb-2">Want to update your journey?</p>
            <div className="flex flex-wrap justify-center gap-4">
              <button
                className="bg-pink-500 hover:bg-pink-600 text-white font-semibold px-5 py-2 rounded"
                onClick={() => (window.location.href = '/onboarding')}
              >
                Continue Onboarding
              </button>
              <button
                className="bg-white border border-pink-400 text-pink-500 font-semibold px-5 py-2 rounded hover:bg-pink-50"
                onClick={() => (window.location.href = '/onboarding?step=7')}
              >
                Jump to Section
              </button>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
