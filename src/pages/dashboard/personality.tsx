import Head from 'next/head';
import MainLayout from '@/layouts/MainLayout';
import Link from 'next/link';
import Head from 'next/head';
import DashboardLayout from '@/layouts/DashboardLayout'; // ✅ Add this last

export default function ResumePage() {
  return (
    <DashboardLayout>
      {/* Your page JSX here */}
    </DashboardLayout>
  );
}

export default function PersonalityDashboard() {
  return (
    <MainLayout>
      <Head>
        <title>Personality Builder | LoveGPT</title>
      </Head>

      <div className="max-w-3xl mx-auto px-6 py-16 text-gray-800">
        <h1 className="text-4xl font-bold text-indigo-700 mb-4">🧠 Build Your Personality Profile</h1>
        <p className="text-gray-600 mb-6">
          Complete your personality profile to unlock your full LoveGPT resume and personalized matchmaking.
        </p>

        <div className="space-y-6">
          <div className="bg-white shadow rounded-xl p-6">
            <h2 className="text-xl font-semibold mb-2 text-pink-600">MBTI Test</h2>
            <p className="text-sm mb-4">Discover your communication style and thought preferences.</p>
            <Link href="/dashboard/personality/mbti/step-1" className="text-sm bg-pink-500 hover:bg-pink-600 text-white px-4 py-2 rounded-lg">
              Start MBTI
            </Link>
          </div>

          {/* More test blocks can be added here */}
        </div>
      </div>
    </MainLayout>
  );
}
