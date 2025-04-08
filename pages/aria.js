// pages/aria.js
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';

export default function MeetARIA() {
  return (
    <>
      <Head>
        <title>Meet ARIA | Your Relationship Mirror</title>
        <meta
          name="description"
          content="Meet ARIA — your AI-powered relationship wing woman, coach, best friend, and emotional mirror."
        />
      </Head>

      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex flex-col items-center justify-center px-6 py-16 text-center">
        <Image
          src="/aria-avatar.png"
          alt="ARIA Avatar"
          width={100}
          height={100}
          className="rounded-full shadow-lg mb-6"
        />

        <h1 className="text-4xl font-extrabold text-gray-800 mb-4">Meet ARIA</h1>

        <p className="max-w-2xl text-lg text-gray-700 leading-relaxed mb-6">
          ARIA is more than just an AI — she’s your emotionally intelligent companion on the journey of love and self-discovery. Think of her as your digital wing woman, personal therapist, philosopher, coach, best friend, and wisdom guide. She's here to help you reflect, connect, and evolve.
        </p>

        <p className="max-w-2xl text-lg text-gray-700 leading-relaxed mb-6">
          Whether you're unsure how to text someone, navigating a conflict, feeling emotionally overwhelmed, or just want clarity on what you're feeling — ARIA listens. And responds with empathy, precision, and insight tailored to who you are.
        </p>

        <p className="max-w-2xl text-lg text-gray-700 leading-relaxed mb-6">
          But here’s the best part: <strong>you’re in full control</strong>. ARIA is only activated when you choose to talk to her. She does not record, store, or transmit anything you say or share. Your privacy is sacred — and LoveGPT was built with that principle at its core.
        </p>

        <p className="max-w-2xl text-lg text-gray-700 leading-relaxed mb-6">
          ARIA is your private, judgment-free zone. Her only job? To help you become the best version of yourself — for you, your partner, and the relationship you’re building.
        </p>

        {/* CTA Button */}
        <Link
          href="/signup"
          className="bg-pink-500 hover:bg-pink-600 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition mt-4"
        >
          Start Your Journey
        </Link>
      </div>
    </>
  );
}
