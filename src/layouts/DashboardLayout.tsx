import React from 'react';
import Link from 'next/link';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [user] = useAuthState(auth);

  return (
    <div className="min-h-screen flex bg-gray-50">
      <aside className="w-64 bg-white shadow-md p-6 space-y-4 hidden md:block">
        <h2 className="text-xl font-bold text-indigo-700 mb-6">LoveGPT Dashboard</h2>
        <ul className="space-y-3 text-sm text-gray-700">
          <li>
            <Link href="/dashboard/resume" className="hover:text-indigo-600">📄 My Resume</Link>
          </li>
          <li>
            <Link href="/dashboard/personality/mbti/summary" className="hover:text-indigo-600">🧠 MBTI Summary</Link>
          </li>
          <li>
            <Link href="/dashboard/personality/disc/summary" className="hover:text-indigo-600">📊 DISC Summary</Link>
          </li>
          <li>
            <Link href="/dashboard/personality/big5/summary" className="hover:text-pink-500">🧬 Big 5 Summary</Link>
          </li>
          <li>
            <Link href="/dashboard/personality/nlp/summary" className="hover:text-indigo-600">🧠 NLP Summary</Link>
          </li>
          <li>
            <Link href="/dashboard/personality/enneagram/summary" className="hover:text-indigo-600">🌀 Enneagram Summary</Link>
          </li>
          <li>
            <Link href="/dashboard/personality/relationship/summary" className="hover:text-rose-500">💞 Relationship Summary</Link>
          </li>
          <li>
            <Link href="/dashboard/personality/parenthood/summary" className="hover:text-indigo-600">👶 Parenthood Summary</Link>
          </li>
          <li>
            <Link href="/dashboard/matches" className="hover:text-indigo-600">💘 Matches</Link>
          </li>
          <li>
            <Link href="/dashboard/settings" className="hover:text-indigo-600">⚙️ Settings</Link>
          </li>
        </ul>
      </aside>

      <main className="flex-1 p-4 md:p-10">
        {user ? children : (
          <div className="text-center text-gray-500">
            🔒 Please sign in to access your dashboard.
          </div>
        )}
      </main>
    </div>
  );
}
