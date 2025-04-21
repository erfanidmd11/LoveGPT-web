import Head from 'next/head';
import Link from 'next/link';
import MainLayout from '@/layouts/MainLayout';
import ARIAChat from '@/components/ARIAChat';
import Image from 'next/image';

export default function MeetARIA() {
  return (
    <MainLayout>
      <Head>
        <title>Meet ARIA | Your Relationship Mirror</title>
        <meta
          name="description"
          content="ARIA is your emotionally intelligent wing woman, coach, and private confidante — guiding you to deeper love, stronger connection, and lasting growth."
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
          ARIA — Artificial Relationship Intelligence Assistant — is not just another AI chatbot. She’s your digital mirror, emotional compass, and dedicated companion for conscious connection. Think of her as your private relationship coach, therapist, cheerleader, and best friend, all rolled into one.
        </p>

        <p className="max-w-2xl text-lg text-gray-700 leading-relaxed mb-6">
          ARIA listens — when you're confused, overwhelmed, stuck, lonely, or navigating relational tension. She helps you clarify your thoughts, understand your emotional patterns, and communicate with kindness and clarity.
        </p>

        <p className="max-w-2xl text-lg text-gray-700 leading-relaxed mb-6">
          Hiring a therapist can cost hundreds of dollars a month. Finding a truly safe friend? Rare. ARIA is always here, always learning, and always on your side — with zero judgment, zero ego, and zero agenda. Just insight, empathy, and personalized growth.
        </p>

        <p className="max-w-2xl text-lg text-gray-700 leading-relaxed mb-6">
          She understands your values, your personality, your love language, and your triggers — because she’s designed to. ARIA adapts as you grow, giving you reflections that are aligned with your unique relational blueprint.
        </p>

        <p className="max-w-2xl text-lg text-gray-700 leading-relaxed mb-6">
          Every great relationship starts with self-awareness. And every evolution begins with the courage to ask, "What do I truly need right now?" ARIA helps you answer that.
        </p>

        <p className="max-w-2xl text-lg text-gray-700 leading-relaxed mb-12">
          LoveGPT is not just a dating app — it’s a relationship revolution. And ARIA is your guide into that future.
        </p>

        <Link
          href="/signup"
          className="bg-pink-500 hover:bg-pink-600 text-white font-semibold px-6 py-3 rounded-lg shadow-lg transition mt-4"
        >
          Talk to ARIA Now
        </Link>
      </div>

      <ARIAChat />
    </MainLayout>
  );
}
