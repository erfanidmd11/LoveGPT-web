import { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface ReferralEntry {
  id: string;
  referredBy: string;
  email: string;
  timestamp: string;
}

export default function AdminReferrals() {
  const [referrals, setReferrals] = useState<ReferralEntry[]>([]);

  useEffect(() => {
    const fetchReferrals = async () => {
      const snapshot = await getDocs(collection(db, 'inviteApplications'));
      const filtered = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(entry => entry.referredBy);

      setReferrals(filtered as ReferralEntry[]);
    };

    fetchReferrals();
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold mb-6">🔗 Referral Activity</h2>

      {referrals.length === 0 ? (
        <p className="text-gray-500">No referrals found.</p>
      ) : (
        referrals.map(ref => (
          <div key={ref.id} className="border p-4 rounded-lg mb-4 bg-white shadow">
            <p><strong>Email:</strong> {ref.email}</p>
            <p><strong>Referred By:</strong> {ref.referredBy}</p>
            {ref.timestamp && <p><strong>Timestamp:</strong> {ref.timestamp}</p>}
          </div>
        ))
      )}
    </div>
  );
}
