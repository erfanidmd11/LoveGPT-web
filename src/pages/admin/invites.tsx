import React, { useState, useEffect } from 'react';
import { getDocs, collection, deleteDoc, doc } from 'firebase/firestore';
import { nanoid } from 'nanoid';
import { createInviteCode } from '@/lib/invites';
import { db, auth } from '@/lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

export default function AdminInviteGenerator() {
  const [user] = useAuthState(auth);
  const [code, setCode] = useState('');
  const [status, setStatus] = useState('idle');
  const [allCodes, setAllCodes] = useState([]);

  const generateCode = () => `LOVE-${nanoid(6).toUpperCase()}`;

  const handleCreateInvite = async () => {
    const newCode = generateCode();
    setStatus('creating');

    try {
      await createInviteCode(newCode, user?.email || 'admin'); // ✅ use shared logic
      setCode(newCode);
      setStatus('success');
      fetchAllCodes();
    } catch (error) {
      console.error('Error creating invite code:', error);
      setStatus('error');
    }
  };

  const fetchAllCodes = async () => {
    const snap = await getDocs(collection(db, 'invitationCodes'));
    const codes = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    setAllCodes(codes);
  };

  const cancelCode = async (id) => {
    const confirm = window.confirm(`Are you sure you want to cancel invite ${id}?`);
    if (!confirm) return;

    try {
      await deleteDoc(doc(db, 'invitationCodes', id));
      fetchAllCodes();
    } catch (error) {
      console.error('Error deleting invite:', error);
    }
  };

  useEffect(() => {
    fetchAllCodes();
  }, []);

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold text-pink-600 mb-4">🔐 Super Admin: Generate Invite Code</h2>

      <button
        onClick={handleCreateInvite}
        className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-2 rounded font-semibold"
      >
        Generate New Code
      </button>

      {status === 'success' && (
        <p className="mt-4 text-green-600 text-lg">
          ✅ Code Created: <strong>{code}</strong>
        </p>
      )}

      {status === 'error' && (
        <p className="mt-4 text-red-500 font-semibold">
          ❌ Something went wrong. Please try again.
        </p>
      )}

      <h3 className="text-xl font-semibold text-gray-800 mt-8 mb-2">📋 Active Invite Codes</h3>
      <div className="space-y-3">
        {allCodes.map((entry) => (
          <div key={entry.id} className="p-3 bg-gray-50 border rounded-lg flex justify-between items-start">
            <div>
              <p className="font-mono text-sm text-gray-700">🔗 {entry.code}</p>
              <p className="text-xs text-gray-500">Created: {new Date(entry.createdAt?.toDate?.() || entry.createdAt).toLocaleString()}</p>
              <p className="text-xs text-gray-500">
                {entry.used
                  ? `✅ Used by ${entry.usedBy} on ${new Date(entry.claimedAt?.toDate?.() || entry.claimedAt).toLocaleString()}`
                  : '🕒 Not yet used'}
              </p>
            </div>
            {!entry.used && (
              <button
                onClick={() => cancelCode(entry.id)}
                className="text-sm bg-red-100 text-red-600 px-3 py-1 rounded hover:bg-red-200"
              >
                Cancel
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
