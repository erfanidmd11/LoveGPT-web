import { useEffect, useState } from 'react';
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  Timestamp,
} from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface WaitlistEntry {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  instagram: string;
  location: string;
  reason: string;
  heardFrom: string;
  referredBy: string;
  status?: string;
}

export default function WaitlistAdminPanel() {
  const [entries, setEntries] = useState<WaitlistEntry[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    const snapshot = await getDocs(collection(db, 'waitlistRequests'));
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as WaitlistEntry));
    setEntries(data);
  };

  const updateStatus = async (id: string, status: 'approved' | 'rejected') => {
    setLoading(true);
    try {
      await updateDoc(doc(db, 'waitlistRequests', id), {
        status,
        reviewedAt: Timestamp.now(),
      });
      fetchEntries();
    } catch (err) {
      console.error('Update failed:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">📝 Waitlist Review Panel</h2>

      {entries.length === 0 ? (
        <p className="text-gray-500">No waitlist entries found.</p>
      ) : (
        entries.map(entry => (
          <div key={entry.id} className="border bg-white rounded-lg p-4 mb-4 shadow-sm">
            <p><strong>Name:</strong> {entry.firstName} {entry.lastName}</p>
            <p><strong>Email:</strong> {entry.email}</p>
            <p><strong>Phone:</strong> {entry.phone}</p>
            <p><strong>Instagram:</strong> {entry.instagram}</p>
            <p><strong>Location:</strong> {entry.location}</p>
            <p><strong>Reason:</strong> {entry.reason}</p>
            <p><strong>Heard From:</strong> {entry.heardFrom}</p>
            <p><strong>Referred By:</strong> {entry.referredBy}</p>

            {!entry.status && (
              <div className="mt-3 flex gap-3">
                <button
                  onClick={() => updateStatus(entry.id, 'approved')}
                  disabled={loading}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                >
                  Approve
                </button>
                <button
                  onClick={() => updateStatus(entry.id, 'rejected')}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                >
                  Reject
                </button>
              </div>
            )}

            {entry.status && (
              <p className="mt-2 text-sm text-gray-600">Status: {entry.status}</p>
            )}
          </div>
        ))
      )}
    </div>
  );
}
