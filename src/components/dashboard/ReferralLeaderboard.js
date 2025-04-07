import React, { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';

export default function ReferralLeaderboard() {
  const [leaders, setLeaders] = useState([]);

  useEffect(() => {
    const fetchReferrals = async () => {
      const q = query(
        collection(db, 'users'),
        orderBy('referralPoints', 'desc'),
        limit(10)
      );

      const snapshot = await getDocs(q);
      const list = snapshot.docs.map(doc => ({
        id: doc.id,
        name: doc.data().onboardingName || 'Anonymous',
        points: doc.data().referralPoints || 0,
        referrals: doc.data().referrals?.length || 0,
        level: doc.data().referralLevel || 1,
      }));

      setLeaders(list);
    };

    fetchReferrals();
  }, []);

  if (!leaders.length) return null;

  return (
    <div className="bg-white shadow rounded-xl p-5">
      <h2 className="text-lg font-bold text-pink-600">🏆 Top Referrers</h2>

      <ul className="mt-4 space-y-3">
        {leaders.map((user, i) => (
          <li
            key={user.id}
            className="flex justify-between items-center text-sm border-b pb-2"
          >
            <div>
              <p className="font-medium text-gray-800">
                {i + 1}. {user.name}
              </p>
              <p className="text-gray-500 text-xs">
                {user.referrals} referrals • Level {user.level}
              </p>
            </div>
            <span className="text-pink-600 font-semibold">{user.points} pts</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

