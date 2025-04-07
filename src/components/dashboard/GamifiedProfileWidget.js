// src/components/dashboard/GamifiedProfileWidget.js
import React, { useEffect, useState } from 'react';
import { calculateUserPoints } from '@/lib/pointEngine';
import { getLevel } from '@/lib/LevelLogic';
import { getBadges } from '@/lib/badgeManager';
import { getAllAnswers } from '@/lib/getAllOnboardingAnswers';

export default function GamifiedProfileWidget() {
  const [points, setPoints] = useState(0);
  const [levelInfo, setLevelInfo] = useState({ level: 1, title: "Reflector" });
  const [badges, setBadges] = useState([]);

  useEffect(() => {
    const userData = getAllAnswers();
    const total = calculateUserPoints(userData);
    setPoints(total);
    setLevelInfo(getLevel(total));
    setBadges(getBadges(userData));
  }, []);

  return (
    <div className="p-5 bg-white border rounded-xl shadow-md space-y-3">
      <h3 className="text-lg font-bold text-pink-600">🎮 Your Growth Stats</h3>

      <div className="text-xl font-bold text-blue-700">
        XP: {points} pts — <span className="text-pink-500">{levelInfo.title}</span>
      </div>

      <div className="mt-2">
        <p className="text-sm font-semibold text-gray-600">🏅 Badges Earned:</p>
        <ul className="flex gap-2 mt-1 flex-wrap text-sm">
          {badges.length > 0 ? (
            badges.map((b, i) => (
              <li
                key={i}
                className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full shadow-sm border border-pink-300"
              >
                {b.emoji} {b.label}
              </li>
            ))
          ) : (
            <p className="text-xs text-gray-400 italic">No badges yet. Keep growing!</p>
          )}
        </ul>
      </div>
    </div>
  );
}
