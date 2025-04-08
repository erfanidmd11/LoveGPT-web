// pages/about.js
import Head from 'next/head';
import Link from 'next/link';

export default function About() {
  return (
    <>
      <Head>
        <title>About LoveGPT | A Movement for Conscious Love</title>
        <meta
          name="description"
          content="Learn about the vision, values, and heart behind LoveGPT — a platform built to foster meaningful love, strong families, and a better world."
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 flex flex-col items-center justify-center px-6 py-16 text-center">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-6">The Heart Behind LoveGPT</h1>

        <p className="max-w-2xl text-gray-700 text-lg leading-relaxed mb-6">
          LoveGPT was born from a deep desire to heal relationships — starting with the one we have with ourselves. In a world chasing image, convenience, and material highs, LoveGPT is a movement to reawaken the true essence of connection: vulnerability, alignment, and conscious growth.
        </p>

        <p className="max-w-2xl text-gray-700 text-lg leading-relaxed mb-6">
          We believe that if we want to make the world a better place, we have to begin by knowing ourselves. When we grow in self-awareness, we can begin to attract a partner aligned in values, lifestyle, and emotional depth. And through that alignment, we can build families rooted in love, truth, and support.
        </p>

        <p className="max-w-2xl text-gray-700 text-lg leading-relaxed mb-6">
          Love isn’t just chemistry. Love is conscious. It’s showing up for your partner with emotional integrity. It’s choosing growth over comfort, listening over reacting, and service over selfishness. It’s not just about falling in love — it’s about <strong>staying in love</strong> through intention, understanding, and shared purpose.
        </p>

        <p className="max-w-2xl text-gray-700 text-lg leading-relaxed mb-6">
          Through our AI guide ARIA, our guided onboarding, and our compatibility engine, we help individuals become more emotionally mature, spiritually grounded, and relationship-ready. Because a better world starts with better love.
        </p>

        <p className="max-w-2xl text-gray-700 text-lg leading-relaxed mb-12">
          We are here to guide you toward true love — not based on likes, filters, or instant gratification — but built on truth, trust, and transformation. This is more than a dating app. This is a revolution in human connection.
        </p>

        {/* Founder Quote */}
        <div className="bg-white shadow-md rounded-xl p-6 max-w-xl text-left border-l-4 border-pink-500 mb-8">
          <p className="text-gray-700 italic text-lg mb-4">
            “If we want to change the world, we must first learn how to love — deeply, consciously, and without fear. LoveGPT is my gift to humanity — to help each of us become who we were meant to be, for ourselves and for each other.”
          </p>
          <p className="text-gray-800 font-semibold text-right">— Shervin Erfani, Founder</p>
        </div>

        {/* CTA Button */}
        <Link
          href="/signup"
          className="bg-pink-500 hover:bg-pink-600 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition"
        >
          Start Your Journey
        </Link>
      </div>
    </>
  );
}
