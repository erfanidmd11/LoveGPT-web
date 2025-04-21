import { useState } from 'react';
import { db } from '@/lib/firebase';
import {
  doc,
  getDoc,
  updateDoc,
  collection,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';

export default function AdminUserEditor() {
  const [uid, setUid] = useState('');
  const [phone, setPhone] = useState('');
  const [user, setUser] = useState<any>(null);
  const [newPhone, setNewPhone] = useState('');
  const [status, setStatus] = useState('');

  const fetchUser = async () => {
    setStatus('🔍 Looking up user...');
    try {
      const ref = doc(db, 'users', uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const userData = snap.data();
        setUser(userData);
        setPhone(userData.phoneNumber || '');
        setStatus('✅ User found.');
      } else {
        setUser(null);
        setStatus('❌ User not found.');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setStatus('❌ Error fetching user.');
    }
  };

  const updatePhone = async () => {
    if (!newPhone) return setStatus('⚠️ Please enter a new phone number.');
    setStatus('🔄 Updating phone...');
    try {
      const userRef = doc(db, 'users', uid);
      await updateDoc(userRef, {
        phoneNumber: newPhone,
        adminEditedPhone: true,
      });

      const logRef = collection(db, 'logs');
      await addDoc(logRef, {
        user_uid: uid,
        old_phone: phone,
        new_phone: newPhone,
        edited_by: 'super_admin',
        editedAt: serverTimestamp(),
      });

      setStatus('✅ Phone number updated!');
    } catch (err) {
      console.error('Update error:', err);
      setStatus('❌ Failed to update phone.');
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6 max-w-xl mx-auto">
      <h2 className="text-xl font-bold text-indigo-700 mb-4">📞 Admin Phone Editor</h2>

      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Enter User UID"
          value={uid}
          onChange={(e) => setUid(e.target.value)}
          className="border px-4 py-2 rounded w-full"
        />
        <button
          onClick={fetchUser}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Fetch User
        </button>
      </div>

      {user && (
        <div className="bg-gray-50 p-4 rounded-lg mt-4 space-y-3 border">
          <p><strong>📱 Current Phone:</strong> {phone || 'N/A'}</p>
          <input
            type="text"
            placeholder="New Phone Number"
            value={newPhone}
            onChange={(e) => setNewPhone(e.target.value)}
            className="border px-4 py-2 rounded w-full"
          />
          <button
            onClick={updatePhone}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 mt-2 rounded"
          >
            Update Phone
          </button>
        </div>
      )}

      {status && <p className="mt-4 text-sm text-gray-700">{status}</p>}
    </div>
  );
}
