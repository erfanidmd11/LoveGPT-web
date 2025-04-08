// pages/signup.js
import React from 'react';
import Link from 'next/link';
import Head from 'next/head';
import Image from 'next/image';
import { useRouter } from 'next/router';

export default function Signup() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Start Your Journey | LoveGPT</title>
        <meta
          name="description"
          content="Begin your personalized relationship journey with ARIA — your emotionally intelligent AI guide."
        />
      </Head>

      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-50 to-purple-100 p-6 text-center">
        {/* ARIA Avatar */}
        <Image
          src="/aria-avatar.png"
          alt="ARIA Avatar"
          width={96}
          height={96}
          className="mb-6 rounded-full shadow-xl border-2 border-white"
        />

        <h1 className="text-4xl font-extrabold text-gray-800 mb-4">
          Ready to Meet Your True Match?
        </h1>

        <p className="text-lg text-gray-600 mb-6 max-w-md">
          With the help of ARIA, you’ll uncover your values, emotional patterns, and ideal relationship flow. All at your own pace. 💫
        </p>

        <button
          onClick={() => router.push('/onboarding')}
          className="bg-pink-500 hover:bg-pink-600 text-white font-semibold px-8 py-3 rounded-lg transition shadow-lg"
        >
          Begin Onboarding
        </button>

        <p className="mt-6 text-sm text-gray-500">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-500 underline hover:text-blue-700">
            Log in
          </Link>
        </p>
      </div>
    </>
  );
}
