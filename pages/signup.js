// pages/signup.js
import React from 'react';
import Link from 'next/link';
import Head from 'next/head';

export default function Signup() {
  return (
    <>
      <Head>
        <title>Start Your Journey | LoveGPT</title>
      </Head>

      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-pink-50 to-purple-100 p-6 text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Begin Your LoveGPT Journey
        </h1>
        <p className="text-gray-600 mb-6 max-w-md">
          ARIA will gently walk you through each step — no pressure. Just self-awareness and discovery. 💫
        </p>

        <Link href="/onboarding" className="bg-pink-500 hover:bg-pink-600 text-white font-semibold px-6 py-3 rounded-lg transition">
          Begin Onboarding
        </Link>

        <p className="mt-4 text-sm text-gray-500">
          Already have an account? <Link href="/login" className="text-blue-500 underline">Log in</Link>
        </p>
      </div>
    </>
  );
}
