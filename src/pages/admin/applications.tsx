import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '@/lib/firebase';
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  Timestamp,
  setDoc,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { generateCode } from '@/utils/invite/generateInviteCode';
import { sendInviteEmail } from '@/lib/mailgun/sendInviteEmail';

interface InviteApplication {
  id: string;
  status: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  handle: string;
  [key: string]: any;
}

export default function AdminApplications() {
  const [applications, setApplications] = useState<InviteApplication[]>([]);
  const [filter, setFilter] = useState('pending');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const [user, authLoading] = useAuthState(typeof window !== 'undefined' ? auth : null);
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && (!user || user.email !== 'thelovegpt.ai@gmail.com')) {
      router.push('/login');
    }
  }, [user, authLoading]);

  useEffect(() => {
    if (user) fetchApplications();
  }, [filter, user]);

  const fetchApplications = async () => {
    const snapshot = await getDocs(collection(db, 'inviteApplications'));
    const all = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as InviteApplication[];
    const filtered = all.filter(app => app.status === filter);
    setApplications(filtered);
  };

  const approveApplication = async (application: InviteApplication) => {
    setLoading(true);
    try {
      const code = generateCode();
      const codeRef = doc(db, 'invitationCodes', code);
      const oneWeekLater = new Date();
      oneWeekLater.setDate(oneWeekLater.getDate() + 7);

      await setDoc(codeRef, {
        code,
        createdAt: Timestamp.now(),
        createdBy: user?.email || 'thelovegpt.ai@gmail.com',
        maxUses: 1,
        usedCount: 0,
        status: 'active',
        expiresAt: oneWeekLater,
      });

      await sendInviteEmail({
        to: application.email,
        firstName: application.firstName,
        inviteCode: code,
      });

      await updateDoc(doc(db, 'inviteApplications', application.id), {
        status: 'approved',
        approvedAt: Timestamp.now(),
      });

      fetchApplications();
    } catch (err) {
      console.error('Approval error:', err);
    } finally {
      setLoading(false);
    }
  };

  const rejectApplication = async (id: string) => {
    await updateDoc(doc(db, 'inviteApplications', id), { status: 'rejected' });
    fetchApplications();
  };

  const filteredApps = applications.filter(app => {
    return (
      app.firstName.toLowerCase().includes(search.toLowerCase()) ||
      app.lastName.toLowerCase().includes(search.toLowerCase()) ||
      app.email.toLowerCase().includes(search.toLowerCase())
    );
  });

  if (authLoading || !user || user.email !== 'admin@thelovegpt.ai') return null;

  return (
    <>
      <Head>
        <title>Super Admin – Applications</title>
      </Head>
      <div className="p-6 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold mb-6">🎛️ Super Admin — Applications</h2>

        <div className="flex items-center justify-between mb-4">
          <div>
            <label className="font-medium mr-2">Filter:</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="border px-3 py-1 rounded"
            >
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <input
            type="text"
            placeholder="Search by name or email..."
            className="border px-4 py-2 rounded w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {filteredApps.length === 0 ? (
          <p className="text-gray-500">No applications found.</p>
        ) : (
          filteredApps.map((app) => (
            <div key={app.id} className="border p-4 rounded-lg mb-4 bg-white shadow">
              <p><strong>Name:</strong> {app.firstName} {app.lastName}</p>
              <p><strong>Email:</strong> {app.email}</p>
              <p><strong>Phone:</strong> {app.phone}</p>
              <p><strong>Handle:</strong> {app.handle}</p>

              {filter === 'pending' && (
                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => approveApplication(app)}
                    className="bg-green-500 text-white px-4 py-2 rounded-lg"
                    disabled={loading}
                  >
                    Approve & Send Code
                  </button>
                  <button
                    onClick={() => rejectApplication(app.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </>
  );
}
