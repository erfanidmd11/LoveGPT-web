import Head from 'next/head';
import MainLayout from '@/layouts/MainLayout';
import Link from 'next/link';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import Head from 'next/head';
import DashboardLayout from '@/layouts/DashboardLayout'; // ✅ Add this last

export default function ResumePage() {
  return (
    <DashboardLayout>
      {/* Your page JSX here */}
    </DashboardLayout>
  );
}

const features = [
  {
    title: 'Compatibility Snapshot',
    description: 'Instantly see how you align with your match based on zodiac, values, and personality.',
    status: 'Completed',
    actionText: 'View Results',
    href: '/compare',
  },
  {
    title: 'Talk to ARIA',
    description: 'Get personalized emotional support, reflections, and guidance 24/7.',
    status: 'Ongoing',
    actionText: 'Talk Now',
    href: '/aria',
  },
  {
    title: 'Growth Journey',
    description: 'Track emotional maturity and complete reflection modules to earn tokens.',
    status: 'In Progress',
    actionText: 'Resume Growth',
    href: '/journey',
  },
  {
    title: 'Invite a Match',
    description: 'Send an invite to compare compatibility with someone you’re talking to.',
    status: 'Not Started',
    actionText: 'Send Invite',
    href: '/invite',
  },
];

export default function DashboardFeatures() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading]);

  if (loading || !user) return null;

  return (
    <MainLayout>
      <Head>
        <title>My LoveGPT Features</title>
      </Head>

      <section className="py-20 px-6 md:px-24 bg-gradient-to-br from-white to-indigo-50 text-gray-800">
        <h1 className="text-4xl font-bold text-center mb-10">Your LoveGPT Dashboard</h1>

        <div className="grid gap-6 md:grid-cols-2 max-w-5xl mx-auto">
          {features.map((f, idx) => (
            <div
              key={idx}
              className="bg-white rounded-xl shadow-md p-6 border-l-4 border-pink-500 hover:shadow-lg transition"
            >
              <h2 className="text-xl font-semibold text-indigo-700 mb-1">{f.title}</h2>
              <p className="text-gray-600 mb-4 text-sm">{f.description}</p>
              <div className="flex items-center justify-between">
                <span className={`text-sm font-medium ${f.status === 'Completed' ? 'text-green-600' : f.status === 'In Progress' ? 'text-yellow-600' : 'text-gray-400'}`}>
                  {f.status}
                </span>
                <Link
                  href={f.href}
                  className="text-sm bg-pink-500 text-white px-4 py-2 rounded-lg font-semibold hover:bg-pink-600 transition"
                >
                  {f.actionText}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </MainLayout>
  );
}
