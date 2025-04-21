import React, { useEffect, useState } from 'react';
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

interface Application {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  handle: string;
  status: string;
}

export default function AdminDashboard() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [filter, setFilter] = useState<'pending' | 'approved' | 'rejected'>('pending');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, [filter]);

  const fetchApplications = async () => {
    const snapshot = await getDocs(collection(db, 'inviteApplications'));
    const all = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Application));
    const filtered = all.filter(app => app.status === filter);
    setApplications(filtered);
  };

  const approveApplication = async (app: Application) => {
    setLoading(true);
    try {
      const code = generateCode();
      const oneWeekFromNow = new Date();
      oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7);

      await setDoc(doc(db, 'invitationCodes', code), {
        code,
        createdBy: 'admin',
        createdAt: Timestamp.now(),
        maxUses: 1,
        usedCount: 0,
        status: 'active',
        expiresAt: oneWeekFromNow,
      });

      await sendInviteEmail({
        to: app.email,
        firstName: app.firstName,
        inviteCode: code,
      });

      await updateDoc(doc(db, 'inviteApplications', app.id), {
        status: 'approved',
        approvedAt: Timestamp.now(),
      });

      fetchApplications();
    } catch (err) {
      console.error('❌ Approval failed:', err);
    } finally {
      setLoading(false);
    }
  };

  const rejectApplication = async (id: string) => {
    await updateDoc(doc(db, 'inviteApplications', id), {
      status: 'rejected',
    });
    fetchApplications();
  };

  const filteredApps = applications.filter(app =>
    [app.firstName, app.lastName, app.email].some(field =>
      field?.toLowerCase().includes(search.toLowerCase())
    )
  );

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">🎛️ Admin — Invite Applications</h2>

      <div className="flex justify-between items-center mb-4">
        <div>
          <label className="font-medium mr-2">Filter:</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'pending' | 'approved' | 'rejected')}
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
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border px-4 py-2 rounded w-64"
        />
      </div>

      {filteredApps.length === 0 ? (
        <p className="text-gray-500">No applications found.</p>
      ) : (
        filteredApps.map(app => (
          <div key={app.id} className="border bg-white rounded-lg p-4 mb-4 shadow-sm">
            <p><strong>Name:</strong> {app.firstName} {app.lastName}</p>
            <p><strong>Email:</strong> {app.email}</p>
            <p><strong>Phone:</strong> {app.phone}</p>
            <p><strong>Handle:</strong> {app.handle}</p>

            {filter === 'pending' && (
              <div className="mt-3 flex gap-3">
                <button
                  onClick={() => approveApplication(app)}
                  disabled={loading}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                >
                  Approve & Send Code
                </button>
                <button
                  onClick={() => rejectApplication(app.id)}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
