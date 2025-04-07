// pages/admin/flagged-matches.jsx
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/router';

// ✅ Corrected import path using alias
const FlaggedMatchesDashboard = dynamic(() =>
  import('@/components/admin/FlaggedMatchesDashboard')
);

const WHITELISTED_EMAILS = [
  'founder@lovegpt.ai',
  'admin@lovegpt.ai',
];

export default function AdminFlaggedMatchesPage() {
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && WHITELISTED_EMAILS.includes(user.email)) {
        setAuthorized(true);
      } else {
        router.push('/');
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Verifying admin access...
      </div>
    );
  }

  return authorized ? <FlaggedMatchesDashboard /> : null;
}
