import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '@/lib/firebase';
import {
  collection,
  getDocs,
  updateDoc,
  deleteDoc,
  doc,
  Timestamp,
  setDoc,
} from 'firebase/firestore';
import { generateCode } from '@/utils/invite/generateCode';
import { SUPER_ADMINS } from '@/config/admins';

export default function InviteCodesDashboard() {
  const router = useRouter();

  const [user, loading] =
    typeof window !== 'undefined' ? useAuthState(auth) : [null, true];

  const [codes, setCodes] = useState<any[]>([]);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    if (!loading && (!user || !SUPER_ADMINS.includes(user?.email ?? ''))) {
      router.push('/admin/login');
    }
  }, [user, loading]);

  useEffect(() => {
    if (user) fetchCodes();
  }, [user]);

  const fetchCodes = async () => {
    const snapshot = await getDocs(collection(db, 'invitationCodes'));
    const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setCodes(list);
  };

  const deactivateCode = async (id: string) => {
    await updateDoc(doc(db, 'invitationCodes', id), { status: 'inactive' });
    fetchCodes();
  };

  const deleteCode = async (id: string) => {
    await deleteDoc(doc(db, 'invitationCodes', id));
    fetchCodes();
  };

  const createCode = async () => {
    setCreating(true);
    const code = generateCode();
    const ref = doc(db, 'invitationCodes', code);
    await setDoc(ref, {
      code,
      createdAt: Timestamp.now(),
      createdBy: user?.email ?? 'admin',
      maxUses: 1,
      usedCount: 0,
      status: 'active',
      expiresAt: null,
    });
    fetchCodes();
    setCreating(false);
  };

  if (loading || !user || !SUPER_ADMINS.includes(user?.email ?? '')) return null;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Head>
        <title>Super Admin – Invite Codes</title>
      </Head>
      <h2 className="text-3xl font-bold mb-6">🔑 Manage Invitation Codes</h2>

      <button
        onClick={createCode}
        className="mb-6 bg-green-500 text-white px-4 py-2 rounded-lg"
        disabled={creating}
      >
        {creating ? 'Creating...' : 'Generate New Code'}
      </button>

      {codes.length === 0 ? (
        <p className="text-gray-500">No invitation codes yet.</p>
      ) : (
        codes.map((code) => (
          <div key={code.id} className="border p-4 rounded-lg mb-4 bg-white shadow">
            <p><strong>Code:</strong> {code.code}</p>
            <p><strong>Status:</strong> {code.status}</p>
            <p><strong>Max Uses:</strong> {code.maxUses}</p>
            <p><strong>Used:</strong> {code.usedCount}</p>
            <p><strong>Expires:</strong> {code.expiresAt ? new Date(code.expiresAt.toDate()).toDateString() : 'No Expiry'}</p>
            <div className="mt-3 flex gap-2">
              <button
                onClick={() => deactivateCode(code.id)}
                className="bg-yellow-500 text-white px-4 py-2 rounded-lg"
              >
                Deactivate
              </button>
              <button
                onClick={() => deleteCode(code.id)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
