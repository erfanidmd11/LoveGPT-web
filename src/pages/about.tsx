import Head from 'next/head';
import Link from 'next/link';
import MainLayout from '@/layouts/MainLayout';
import ARIAChat from '@/components/ARIAChat';

export default function About() {
  return (
    <MainLayout>
      <Head>
        <title>About LoveGPT | Join the Relationship Revolution</title>
        <meta
          name="description"
          content="Learn about the movement behind LoveGPT — a platform for conscious connection, emotional growth, and redefining love to elevate humanity."
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 flex flex-col items-center justify-center px-6 py-16 text-center">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-6">The Heart Behind LoveGPT</h1>

        <p className="max-w-2xl text-gray-700 text-lg leading-relaxed mb-6">
          LoveGPT was born from a single question: What if love could be understood, nurtured, and aligned — not by chance, but by design? In a world disconnected by distraction, we are reconnecting humanity at its core.
        </p>

        <p className="max-w-2xl text-gray-700 text-lg leading-relaxed mb-6">
          This isn’t just another app. It’s a movement. A conscious technology designed to guide people back to themselves — and to the kinds of relationships that uplift, support, and expand our lives.
        </p>

        <p className="max-w-2xl text-gray-700 text-lg leading-relaxed mb-6">
          We believe everyone deserves the opportunity to build an extraordinary life. And that extraordinary means something different for each of us. Whether it’s family, partnership, personal evolution, or impact — love is at the root of it all.
        </p>

        <p className="max-w-2xl text-gray-700 text-lg leading-relaxed mb-6">
          With ARIA — our emotionally intelligent AI — LoveGPT helps people discover who they are, what they value, and who truly aligns with them. This is a platform where your emotional growth is rewarded. Where mentorship matters. Where compatibility goes beyond the surface.
        </p>

        <p className="max-w-2xl text-gray-700 text-lg leading-relaxed mb-12">
          By joining LoveGPT, you’re not just signing up to date. You’re joining a mission: to raise the collective consciousness of relationships and create a world where people don’t just fall in love — they rise in love.
        </p>

        <div className="bg-white shadow-md rounded-xl p-6 max-w-xl text-left border-l-4 border-pink-500 mb-8">
          <p className="text-gray-700 italic text-lg mb-4">
            “If we want to change the world, we must first learn how to love — and that begins with the self.”
          </p>
          <p className="text-gray-800 font-semibold text-right">— Shervin Erfani, Founder</p>
        </div>

        <Link
          href="/signup"
          className="bg-pink-500 hover:bg-pink-600 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition"
        >
          Join the Movement
        </Link>
      </div>

      <ARIAChat />
    </MainLayout>
  );
}
