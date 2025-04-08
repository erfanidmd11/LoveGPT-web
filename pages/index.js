// pages/index.js
import Head from 'next/head';
import MainLayout from '@/layouts/MainLayout';
import ARIAChat from '@/components/ARIAChat';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';

export default function Home() {
  const [user, loading] = useAuthState(auth);

  return (
    <MainLayout>
      <Head>
        <title>LoveGPT — Emotional AI for Real Relationships</title>
        <meta
          name="description"
          content="Meet ARIA — your emotionally intelligent AI guide for love, growth, and compatibility."
        />
      </Head>

      {loading ? (
        <div className="text-center py-20 text-gray-600">Loading...</div>
      ) : (
        <section className="text-center mt-10">
          <h1 className="text-5xl font-extrabold text-gray-800 mb-4">
            Welcome to <span className="text-pink-500">Love</span><span className="text-blue-500">GPT</span>
          </h1>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            ARIA is your AI-powered relationship mirror — here to help you reflect,
            grow, and prepare for meaningful love. Ask her anything. She's listening. 🌸
          </p>

          <div className="bg-white border border-pink-100 shadow-lg p-4 rounded-xl w-full max-w-md mx-auto">
            <p className="text-sm text-gray-500">
              “From first reflection to first kiss — I’m here for it all.” — <span className="text-pink-500 font-semibold">ARIA</span>
            </p>
          </div>
        </section>
      )}

      <ARIAChat />
    </MainLayout>
  );
}
