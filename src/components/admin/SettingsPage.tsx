import Head from 'next/head';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import { useRouter } from 'next/router';
import { SUPER_ADMINS } from '@/config/admins';
import { useState } from 'react';

export default function AdminSettings() {
  const [user, loading] = useAuthState(auth);
  const router = useRouter();
  const [admins, setAdmins] = useState<string[]>(SUPER_ADMINS);
  const [newEmail, setNewEmail] = useState('');

  if (!loading && (!user || !SUPER_ADMINS.includes(user.email))) {
    router.push('/login');
    return null;
  }

  const handleAddAdmin = () => {
    if (newEmail && !admins.includes(newEmail)) {
      setAdmins(prev => [...prev, newEmail]);
      setNewEmail('');
    }
  };

  const handleRemoveAdmin = (email: string) => {
    setAdmins(prev => prev.filter(a => a !== email));
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <Head>
        <title>Admin Settings | Super Admins</title>
      </Head>
      <h1 className="text-3xl font-bold mb-6">🛠️ Admin Settings</h1>
      <h2 className="text-lg font-semibold mb-2 text-gray-700">Super Admin Emails:</h2>
      <ul className="mb-4 list-disc ml-6 text-sm text-gray-800">
        {admins.map((email, idx) => (
          <li key={idx} className="flex justify-between items-center mb-1">
            <span>{email}</span>
            <button
              onClick={() => handleRemoveAdmin(email)}
              className="text-red-500 text-xs hover:underline"
            >
              Remove
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-6">
        <h3 className="font-medium mb-1 text-sm text-gray-600">Add New Admin Email</h3>
        <div className="flex gap-2">
          <input
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
            type="email"
            placeholder="admin@example.com"
            className="border px-3 py-2 rounded w-full text-sm"
          />
          <button
            onClick={handleAddAdmin}
            className="bg-indigo-600 text-white px-4 py-2 rounded text-sm hover:bg-indigo-700"
          >
            Add
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2">Note: This does not persist — for visual testing only.</p>
      </div>
    </div>
  );
}
