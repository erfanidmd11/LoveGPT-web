import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { signOut } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { SUPER_ADMINS } from '@/config/admins';

export default function AdminNavBar() {
  const router = useRouter();
  const [user, loading] = useAuthState(auth);
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || loading) return;

    const isLoggedIn = localStorage.getItem('admin_logged_in') === 'true';
    const isSuperAdmin = user && SUPER_ADMINS.includes(user.email || '');

    if (!user || !isLoggedIn || !isSuperAdmin) {
      router.replace('/admin/login');
    } else {
      setAuthorized(true);
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    await signOut(auth);
    localStorage.removeItem('admin_logged_in');
    router.push('/admin/login');
  };

  if (loading || !authorized) {
    return <div className="text-center p-10 text-gray-500">Checking admin access...</div>;
  }

  return (
    <div className="flex justify-between items-center bg-gray-100 px-6 py-4 border-b">
      <h1 className="text-lg font-bold text-pink-600">LoveGPT Admin Panel</h1>
      <button
        onClick={handleLogout}
        className="text-sm text-red-500 hover:text-red-600 font-medium"
      >
        Logout
      </button>
    </div>
  );
}
