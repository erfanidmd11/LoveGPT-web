import Head from 'next/head';
import Link from 'next/link';
import MainLayout from '@/layouts/MainLayout';
import ARIAChat from '@/components/ARIAChat';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';

export default function About() {
  return (
    <MainLayout>
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
          LoveGPT was born from a deep desire to heal relationships — starting with the one we have with ourselves...
        </p>

        <p className="max-w-2xl text-gray-700 text-lg leading-relaxed mb-6">
          We believe that if we want to make the world a better place...
        </p>

        <p className="max-w-2xl text-gray-700 text-lg leading-relaxed mb-6">
          Love isn’t just chemistry. Love is conscious...
        </p>

        <p className="max-w-2xl text-gray-700 text-lg leading-relaxed mb-6">
          Through our AI guide ARIA, our guided onboarding...
        </p>

        <p className="max-w-2xl text-gray-700 text-lg leading-relaxed mb-12">
          We are here to guide you toward true love — not based on likes...
        </p>

        <div className="bg-white shadow-md rounded-xl p-6 max-w-xl text-left border-l-4 border-pink-500 mb-8">
          <p className="text-gray-700 italic text-lg mb-4">
            “If we want to change the world, we must first learn how to love...”
          </p>
          <p className="text-gray-800 font-semibold text-right">— Shervin Erfani, Founder</p>
        </div>

        <Link
          href="/signup"
          className="bg-pink-500 hover:bg-pink-600 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition"
        >
          Start Your Journey
        </Link>
      </div>

      <ARIAChat />
    </MainLayout>
  );
}
